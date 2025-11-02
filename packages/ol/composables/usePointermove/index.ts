import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { CSSProperties, MaybeRefOrGetter, VNodeChild } from 'vue'
import type { LayerLike, OLMap } from '../../types'
import { getCenter } from 'ol/extent'
import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue'

export interface PointermovePosition {
  x: number
  y: number
}

interface PointermoveContentParams {
  map: OLMap
  coordinate: Coordinate
  position: PointermovePosition
  feature: FeatureLike
  layer?: LayerLike
}

type Cursor = CSSProperties['cursor']

export type PointermoveItem<T extends Option = Option> = {
  /** 提示内容，支持函数动态生成 */
  content?: ((params: PointermoveContentParams) => VNodeChild) | string
  /** 是否显示提示，可根据 feature 动态判断 */
  visible?: ((params: PointermoveContentParams) => boolean | undefined | void) | boolean
  /** 位置偏移 */
  offset?: { x?: number, y?: number }
  /** 优先级，数字越大优先级越高，当多个 tooltip 匹配时，显示优先级最高的 */
  priority?: number
  /** 鼠标样式，如 'pointer', 'crosshair', 'move' 等 */
  cursor?: Cursor | ((params: PointermoveContentParams) => Cursor)
  /** 固定在feature center 默认启用，若要关闭需要同时开启强制更新 */
  fixedFeatureCenter?: boolean
} & T

export type PointermoveList<T extends Option = Option> = PointermoveItem<T>[]

export interface Option {
  [key: string]: any
}

export interface UsePointermoveOptions<T extends Option = Option> {
  /** 地图实例 */
  mapRef: MaybeRefOrGetter<OLMap | undefined>
  /** 提示配置列表 */
  items: MaybeRefOrGetter<PointermoveList<T>>
  /** 前置判断条件 */
  enabled?: boolean | (() => boolean | undefined | void)
  /** 强制更新 （开启后，无论 feature 是否变化，都强制更新提示） */
  forceUpdate?: boolean
}

export function usePointermove<T extends Option>(
  { mapRef, items, enabled = true, forceUpdate = false }: UsePointermoveOptions<T>,
) {
  const visible = ref(false)
  // 原始位置
  const originalPosition = ref<PointermovePosition>({ x: 0, y: 0 })
  const feature = ref<FeatureLike>()
  const content = ref<(() => VNodeChild) | string>()
  const offset = ref<{ x: number, y: number }>({ x: 0, y: 0 })
  const coordinate = ref<Coordinate>()
  const option = ref<T>()
  const position = computed(() => ({
    x: originalPosition.value.x + offset.value.x,
    y: originalPosition.value.y + offset.value.y,
  }))

  const getEnabled = () => {
    if (typeof enabled === 'function') {
      return enabled()
    }
    return enabled
  }

  let currentMap: OLMap | undefined
  let viewport: HTMLElement | undefined
  let originalCursor: string = ''

  /** 查找匹配的 tooltip 配置 */
  function findMatchingPointermove(params: PointermoveContentParams): PointermoveItem<T> | undefined {
    const tooltips = toValue(items)
    // 先排序，优先级高的在前面
    tooltips.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    // 拿到第一个匹配的
    return tooltips.find((item) => {
      const shouldShow = item.visible
      if (typeof shouldShow === 'function') {
        return shouldShow(params)
      }
      return shouldShow ?? true
    })
  }

  /** 显示提示 */
  function show(evt: MouseEvent) {
    if (!getEnabled()) {
      hide()
      return
    }
    if (!currentMap || !viewport)
      return

    const _coordinate = currentMap.getEventCoordinate(evt)
    coordinate.value = _coordinate
    const pixel = currentMap.getEventPixel(evt)

    let foundFeature: FeatureLike | undefined
    let foundLayer: LayerLike | undefined

    currentMap.forEachFeatureAtPixel(pixel, (feature, layer) => {
      foundFeature = feature
      foundLayer = layer
      return true
    })

    // 如果没有找到 feature，不显示提示
    if (!foundFeature) {
      hide()
      return
    }

    if (!forceUpdate && feature.value && feature.value.getId() === foundFeature.getId()) {
      return
    }

    feature.value = foundFeature

    const params = {
      map: currentMap,
      position: { x: evt.clientX, y: evt.clientY },
      coordinate: _coordinate,
      feature: foundFeature,
      layer: foundLayer,
    }

    // 查找匹配的 tooltip 配置
    const matchedPointermove = findMatchingPointermove(params)
    if (matchedPointermove) {
      const { content: _content, cursor: _cursor, visible: _visible, fixedFeatureCenter: _fixedFeatureCenter, offset: _offset, priority: _priority, ...rest } = matchedPointermove
      option.value = { ...rest } as unknown as T
    }
    if (!matchedPointermove) {
      hide()
      return
    }

    // 计算位置（带偏移）
    const offsetX = matchedPointermove.offset?.x ?? 0
    const offsetY = matchedPointermove.offset?.y ?? 0
    offset.value = { x: offsetX, y: offsetY }
    const fixedFeatureCenter = forceUpdate === false ? true : (matchedPointermove.fixedFeatureCenter ?? true)
    const geometry = foundFeature.getGeometry()
    if (fixedFeatureCenter && geometry) {
      const extent = geometry.getExtent()
      const center = getCenter(extent)
      const pixel = currentMap.getPixelFromCoordinate(center)
      const { top, left } = viewport.getBoundingClientRect()
      originalPosition.value.x = pixel[0] + left
      originalPosition.value.y = pixel[1] + top
    }
    else {
      originalPosition.value = { x: evt.clientX, y: evt.clientY }
    }
    // 设置内容
    const tooltipContent = matchedPointermove.content
    content.value = typeof tooltipContent === 'function'
      ? () => tooltipContent(params)
      : tooltipContent

    // 设置鼠标样式
    const cursor = matchedPointermove.cursor
    const cursorStyle = typeof cursor === 'function'
      ? cursor(params)
      : cursor

    if (cursorStyle !== undefined && cursorStyle !== viewport.style.cursor) {
      viewport.style.cursor = cursorStyle
    }
    visible.value = true
  }

  /** 隐藏提示 */
  function hide() {
    visible.value = false
    feature.value = undefined
    // 恢复原始鼠标样式
    if (viewport && viewport.style.cursor !== originalCursor) {
      viewport.style.cursor = originalCursor
    }
  }

  /** 绑定事件 */
  function bindMapEvents(viewport: HTMLElement) {
    viewport.addEventListener('pointermove', show)
  }

  /** 解绑事件 */
  function unbindMapEvents(viewport: HTMLElement) {
    viewport.removeEventListener('pointermove', show)
  }

  /** 监听 mapRef 变化 */
  watch(
    () => toValue(mapRef),
    (newMap, oldMap) => {
      if (oldMap !== newMap) {
        currentMap = newMap
        if (newMap) {
          viewport = newMap.getViewport()
          unbindMapEvents(viewport)
          bindMapEvents(viewport)
          originalCursor = viewport.style.cursor
        }
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (viewport) {
      unbindMapEvents(viewport)
    }
  })

  return {
    visible: computed(() => visible.value),
    position: computed(() => position.value),
    originalPosition: computed(() => originalPosition.value),
    feature: computed(() => feature.value),
    content: computed(() => content.value),
    coordinate: computed(() => coordinate.value),
    option: computed(() => option.value),
    hide,
  }
}

export type UsePointermoveReturn = ReturnType<typeof usePointermove>
export type UsePointermoveParams<T extends Option> = Parameters<typeof usePointermove<T>>
export type UsePointermoveFn<T extends Option> = (...args: UsePointermoveParams<T>) => UsePointermoveReturn
