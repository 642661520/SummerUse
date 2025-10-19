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
  content: ((params: PointermoveContentParams) => VNodeChild) | string
  /** 是否显示提示，可根据 feature 动态判断 */
  visible?: ((params: PointermoveContentParams) => boolean) | boolean
  /** 位置偏移 */
  offset?: { x?: number, y?: number }
  /** 优先级，数字越大优先级越高，当多个 tooltip 匹配时，显示优先级最高的 */
  priority?: number
  /** 鼠标样式，如 'pointer', 'crosshair', 'move' 等 */
  cursor?: Cursor | ((params: PointermoveContentParams) => Cursor)
  /** 固定在feature center  */
  fixedFeatureCenter?: boolean
} & T

export type PointermoveList<T extends Option = Option> = PointermoveItem<T>[]

export interface Option {
  [key: string]: any
}

export function usePointermove<T extends Option>(
  mapRef: MaybeRefOrGetter<OLMap | undefined>,
  items: MaybeRefOrGetter<PointermoveList<T>>,
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

  let currentMap: OLMap | undefined
  let originalCursor: string = ''

  /** 查找匹配的 tooltip 配置 */
  function findMatchingPointermove(params: PointermoveContentParams): PointermoveItem<T> | null {
    const tooltips = toValue(items)

    // 过滤出可见的 tooltip
    const options = tooltips.filter((item) => {
      const shouldShow = item.visible
      if (typeof shouldShow === 'function') {
        return shouldShow(params)
      }
      return shouldShow ?? true
    })

    if (options.length === 0) {
      return null
    }

    // 按优先级排序，返回优先级最高的
    return options.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0]
  }

  /** 显示提示 */
  function show(evt: MouseEvent) {
    if (!currentMap)
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
      const { content, cursor, visible, fixedFeatureCenter, offset, priority, ...rest } = matchedPointermove
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
    const fixedFeatureCenter = matchedPointermove.fixedFeatureCenter ?? true
    const geometry = foundFeature.getGeometry()
    if (fixedFeatureCenter && geometry) {
      const extent = geometry.getExtent()
      const center = getCenter(extent)
      const pixel = currentMap.getPixelFromCoordinate(center)
      const { top, left } = currentMap.getViewport().getBoundingClientRect()
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

    if (cursorStyle && currentMap) {
      const viewport = currentMap.getViewport()
      if (!originalCursor) {
        originalCursor = viewport.style.cursor
      }
      viewport.style.cursor = cursorStyle
    }
    visible.value = true
  }

  /** 隐藏提示 */
  function hide() {
    visible.value = false
    feature.value = undefined
    // 恢复原始鼠标样式
    if (currentMap && originalCursor !== undefined) {
      const viewport = currentMap.getViewport()
      viewport.style.cursor = originalCursor
      originalCursor = ''
    }
  }

  /** 绑定事件 */
  function bindMapEvents(map?: OLMap) {
    if (!map)
      return

    const el = map.getViewport()
    el.addEventListener('pointermove', show)
    el.addEventListener('pointerout', hide)
  }

  /** 解绑事件 */
  function unbindMapEvents(map?: OLMap) {
    if (!map)
      return

    const el = map.getViewport()
    el.removeEventListener('pointermove', show)
    el.removeEventListener('pointerout', hide)
  }

  /** 监听 mapRef 变化 */
  watch(
    () => toValue(mapRef),
    (newMap, oldMap) => {
      if (oldMap !== newMap) {
        unbindMapEvents(oldMap)
        bindMapEvents(newMap)
        currentMap = newMap
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    unbindMapEvents(currentMap)
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
