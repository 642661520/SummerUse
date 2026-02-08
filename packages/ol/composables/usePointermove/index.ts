import type { MapBrowserEvent } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { CSSProperties, MaybeRefOrGetter, VNodeChild } from 'vue'
import type { LayerLike, OLMap, Option } from '../../types'
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
  layer: LayerLike
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
  /** Hit-detection 容差（css像素），用于扩大检测范围 */
  hitTolerance?: number
} & T

export type PointermoveList<T extends Option = Option> = PointermoveItem<T>[]

export interface UsePointermoveOptions<T extends Option = Option> {
  /** 地图实例 */
  mapRef: MaybeRefOrGetter<OLMap | undefined>
  /** 提示配置列表 */
  items: MaybeRefOrGetter<PointermoveList<T>>
  /** 强制更新 （开启后，无论 feature 是否变化，都强制更新提示） */
  forceUpdate?: boolean
}

export function usePointermove<T extends Option>(
  { mapRef, items, forceUpdate = false }: UsePointermoveOptions<T>,
) {
  const visible = ref(false)
  // 原始位置
  const originalPosition = ref<PointermovePosition>({ x: 0, y: 0 })
  const feature = ref<FeatureLike>()
  const content = ref<(() => VNodeChild) | string>()
  const offset = ref<{ x: number, y: number }>({ x: 0, y: 0 })
  const originalCoordinate = ref<Coordinate>()
  const coordinate = ref<Coordinate>()
  const option = ref<T>()
  const position = computed(() => ({
    x: originalPosition.value.x + offset.value.x,
    y: originalPosition.value.y + offset.value.y,
  }))

  let currentMap: OLMap | undefined
  let viewport: HTMLElement | undefined
  let originalCursor: string = ''

  /** 按优先级排序，然后按相邻相同 tolerance 分组 */
  function groupItemsByPriorityWithToleranceMerge(tooltips: PointermoveList<T>): Array<{
    tolerance: number
    items: PointermoveList<T>
  }> {
    // 第一步：按优先级排序（从高到低）
    const sortedByPriority = [...tooltips].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    )

    // 第二步：按相邻相同 tolerance 分组（保持优先级顺序）
    const groups: Array<{ tolerance: number, items: PointermoveList<T> }> = []
    let currentGroup: { tolerance: number, items: PointermoveList<T> } | null = null

    sortedByPriority.forEach((item) => {
      const tolerance = item.hitTolerance ?? 0

      if (!currentGroup || currentGroup.tolerance !== tolerance) {
        // 新的 tolerance，创建新分组
        currentGroup = { tolerance, items: [item] }
        groups.push(currentGroup)
      }
      else {
        // 相同 tolerance，加入当前分组
        currentGroup.items.push(item)
      }
    })

    return groups
  }

  /** 显示提示 */
  function show(evt: MapBrowserEvent) {
    if (evt.dragging) {
      return
    }

    if (!currentMap || !viewport)
      return

    const _coordinate = evt.coordinate
    originalCoordinate.value = _coordinate
    coordinate.value = _coordinate

    let pixel = evt.pixel

    const tooltips = toValue(items)
    // 按优先级排序，相邻相同 tolerance 的配置合并
    const groupedItems = groupItemsByPriorityWithToleranceMerge(tooltips)

    const { top, left } = viewport.getBoundingClientRect()

    let matchedPointermove: PointermoveItem<T> | undefined
    let foundFeature: FeatureLike | undefined
    let foundLayer: LayerLike | undefined

    // 遍历分组（按优先级顺序）
    for (const group of groupedItems) {
      // 用该分组的 hitTolerance 一次性检测所有相邻的配置
      currentMap.forEachFeatureAtPixel(
        pixel,
        (feature, layer) => {
          foundFeature = feature
          foundLayer = layer
          return true
        },
        { hitTolerance: group.tolerance },
      )

      if (!foundFeature) {
        // 该分组没找到 feature，继续下一组
        foundFeature = undefined
        foundLayer = undefined
        continue
      }

      // 找到了 feature，在该分组内查找第一个 visible=true 的配置
      const params = {
        map: currentMap,
        position: { x: pixel[0] + left, y: pixel[1] + top },
        coordinate: _coordinate,
        feature: foundFeature,
        layer: foundLayer!,
      }

      for (const item of group.items) {
        const shouldShow = item.visible
        const isVisible = typeof shouldShow === 'function' ? shouldShow(params) : (shouldShow ?? true)

        if (isVisible) {
          // 优先级最高且符合 visible 条件的配置
          matchedPointermove = item
          break
        }
      }

      if (matchedPointermove) {
        break // 找到了，停止搜索其他分组
      }

      // 该分组的所有配置都不匹配 visible 条件，重置继续下一组
      foundFeature = undefined
      foundLayer = undefined
    }

    // 如果没有找到匹配的配置，隐藏提示
    if (!foundFeature || !matchedPointermove) {
      hide()
      return
    }

    if (!forceUpdate && feature.value && feature.value.getId() === foundFeature.getId()) {
      return
    }

    feature.value = foundFeature
    const { content: _content, cursor: _cursor, visible: _visible, fixedFeatureCenter: _fixedFeatureCenter, offset: _offset, priority: _priority, hitTolerance: _hitTolerance, originalIndex, ...rest } = matchedPointermove
    option.value = { ...rest } as unknown as T

    // 计算位置（带偏移）
    const offsetX = matchedPointermove.offset?.x ?? 0
    const offsetY = matchedPointermove.offset?.y ?? 0
    offset.value = { x: offsetX, y: offsetY }
    const fixedFeatureCenter = forceUpdate === false ? true : (matchedPointermove.fixedFeatureCenter ?? true)
    const geometry = foundFeature.getGeometry()
    if (fixedFeatureCenter && geometry) {
      const extent = geometry.getExtent()
      const center = getCenter(extent)
      coordinate.value = center
      pixel = currentMap.getPixelFromCoordinate(center)
    }
    originalPosition.value.x = pixel[0] + left
    originalPosition.value.y = pixel[1] + top
    // 设置内容
    const tooltipContent = matchedPointermove.content
    content.value = typeof tooltipContent === 'function'
      ? () => tooltipContent({
          map: currentMap!,
          coordinate: coordinate.value!,
          position: position.value,
          feature: foundFeature!,
          layer: foundLayer!,
        })
      : tooltipContent

    // 设置鼠标样式
    const cursor = matchedPointermove.cursor
    const cursorStyle = typeof cursor === 'function'
      ? cursor({
          map: currentMap,
          coordinate: coordinate.value!,
          position: position.value,
          feature: foundFeature,
          layer: foundLayer!,
        })
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
  function bindMapEvents(map: OLMap) {
    map.on('pointermove', show)
  }

  /** 解绑事件 */
  function unbindMapEvents(map: OLMap) {
    map.un('pointermove', show)
  }

  /** 监听 mapRef 变化 */
  watch(
    () => toValue(mapRef),
    (newMap, oldMap) => {
      if (oldMap) {
        unbindMapEvents(oldMap)
      }
      if (oldMap !== newMap) {
        currentMap = newMap
        if (newMap) {
          viewport = newMap.getViewport()

          bindMapEvents(newMap)
          originalCursor = viewport.style.cursor
        }
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (currentMap) {
      unbindMapEvents(currentMap)
    }
  })

  return {
    visible: computed(() => visible.value),
    position: computed(() => position.value),
    offset: computed(() => offset.value),
    originalPosition: computed(() => originalPosition.value),
    feature: computed(() => feature.value),
    content: computed(() => content.value),
    originalCoordinate: computed(() => originalCoordinate.value),
    coordinate: computed(() => coordinate.value),
    option: computed(() => option.value),
    hide,
  }
}

export type UsePointermoveReturn = ReturnType<typeof usePointermove>
export type UsePointermoveParams<T extends Option> = Parameters<typeof usePointermove<T>>
export type UsePointermoveFn<T extends Option> = (...args: UsePointermoveParams<T>) => UsePointermoveReturn
