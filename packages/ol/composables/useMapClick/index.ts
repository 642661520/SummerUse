import type { MapBrowserEvent } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { Pixel } from 'ol/pixel'
import type { MaybeRefOrGetter } from 'vue'
import type { LayerLike, OLMap, Option } from '../../types'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

/** 点击事件类型 */
export type ClickEventType = 'click' | 'dblclick' | 'singleclick'

/**
 * 点击事件处理的上下文参数
 */
export interface ClickContext {
  map: OLMap
  coordinate: Coordinate
  pixel: Pixel
  feature?: FeatureLike
  layer: LayerLike
}

/**
 * 点击配置
 */
export type ClickConfig<T extends Option> = {
  /** Hit-detection 容差（css像素） */
  hitTolerance?: number
  /** 优先级，数字越大越优先 */
  priority?: number
  /** 是否处理这个点击 */
  visible?: (context: ClickContext) => boolean | undefined | void
  /** 点击回调 */
  handler: (context: ClickContext) => void
  /** 扩展配置 */
} & T

export type ClickConfigList<T extends Option> = ClickConfig<T>[]

export interface UseClickHandlerOptions<T extends Option = Option> {
  /** 地图实例 */
  mapRef: MaybeRefOrGetter<OLMap | undefined>
  /** 提示配置列表 */
  items: MaybeRefOrGetter<ClickConfigList<T>>
  /** 事件类型 */
  type: ClickEventType
}

/**
 * 通用的点击处理 Hook
 */
export function useMapClickHandler<T extends Option = Option>(
  options: UseClickHandlerOptions<T>,
) {
  const { mapRef, items } = options
  let currentMap: OLMap | undefined

  /** 按优先级和 hitTolerance 分组 */
  function groupConfigsByPriority(
    configs: ClickConfigList<T>,
  ): Array<{
    tolerance: number
    items: ClickConfigList<T>
  }> {
    // 按优先级排序
    const sorted = [...configs].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    )

    // 按相邻相同 tolerance 分组
    const groups: Array<{ tolerance: number, items: ClickConfigList<T> }> = []
    let currentGroup: { tolerance: number, items: ClickConfigList<T> } | null = null

    sorted.forEach((item) => {
      const tolerance = item.hitTolerance ?? 0

      if (!currentGroup || currentGroup.tolerance !== tolerance) {
        currentGroup = { tolerance, items: [item] }
        groups.push(currentGroup)
      }
      else {
        currentGroup.items.push(item)
      }
    })

    return groups
  }

  /** 创建点击事件处理器 */
  function handler(evt: MapBrowserEvent) {
    const map = evt.map as OLMap
    if (!map)
      return

    const grouped = groupConfigsByPriority(toValue(items))

    let config: ClickConfig<T> | undefined
    let foundFeature: FeatureLike | undefined
    let foundLayer: LayerLike | undefined

    for (const group of grouped) {
      map.forEachFeatureAtPixel(
        evt.pixel,
        (feature, layer) => {
          foundFeature = feature
          foundLayer = layer
          return true
        },
        { hitTolerance: group.tolerance },
      )

      if (!foundFeature) {
        continue
      }

      const context: ClickContext = {
        map,
        coordinate: evt.coordinate,
        pixel: evt.pixel,
        feature: foundFeature,
        layer: foundLayer!,
      }

      // 在该分组内查找第一个 visible=true 的配置
      for (const config of group.items) {
        const visible = config.visible
        const isVisible = typeof visible === 'function' ? visible(context) : true

        if (isVisible) {
          return { config, feature: foundFeature, layer: foundLayer! }
        }
      }
    }

    if (!config) {
      return
    }

    const context: ClickContext = {
      map,
      coordinate: evt.coordinate,
      pixel: evt.pixel,
      feature: foundFeature,
      layer: foundLayer!,
    }

    config.handler(context)
  }
  /** 绑定事件 */
  function bindMapEvents(map: OLMap) {
    map.on(options.type, handler)
  }

  /** 解绑事件 */
  function unbindMapEvents(map: OLMap) {
    map.un(options.type, handler)
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
          bindMapEvents(newMap)
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
}

export type UseMapClickHandlerReturn = ReturnType<typeof useMapClickHandler>

export function useMapClick<T extends Option = Option>(
  mapRef: MaybeRefOrGetter<OLMap | undefined>,
  type: ClickEventType,
) {
  const itemMap = shallowRef<{
    [key: string]: ClickConfigList<T>
  }>({
  })

  useMapClickHandler({
    mapRef,
    items: computed(() => Object.values(itemMap.value).flat()),
    type,
  })

  const add = (key: string, items: ClickConfigList<T>) => {
    itemMap.value[key] = items
  }
  const remove = (key: string) => {
    delete itemMap.value[key]
  }

  return {
    add,
    remove,
  }
}

export type UseMapClickReturn = ReturnType<typeof useMapClick>
