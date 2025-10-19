import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { LayerLike, OLMap } from '../../types'
import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue'

export interface ContextmenuPosition {
  x: number
  y: number
}

interface ContextmenuItemParams { map: OLMap, coordinate: Coordinate, position: ContextmenuPosition, feature?: FeatureLike, layer?: LayerLike }


export interface ContextmenuItemBase {
  label: ((params: ContextmenuItemParams) => VNodeChild) | string
  visible?: ((params: ContextmenuItemParams) => boolean) | boolean
  disabled?: ((params: ContextmenuItemParams) => boolean) | boolean
  action?: (params: ContextmenuItemParams) => void
  divided?: boolean
  icon?: ((params: ContextmenuItemParams) => VNodeChild) | string
  order?: number
  key?: string | number
  [key: string]: any
}

export interface ContextmenuItem extends ContextmenuItemBase {
  children?: Array<ContextmenuItem>
}

export type ContextmenuList = ContextmenuItem[]

export interface ContextmenuOptionBase {
  label: string | (() => VNodeChild)
  visible?: boolean
  disabled?: boolean
  action: () => void
  divided?: boolean
  icon?: string | (() => VNodeChild)
  order?: number
  key?: string | number
  [key: string]: any
}

export interface ContextmenuOption extends ContextmenuOptionBase {
  children?: Array<ContextmenuOption>
}

export type ContextmenuOptions = ContextmenuOption[]

export function useContextmenu(mapRef: MaybeRefOrGetter<OLMap | undefined>, items: MaybeRefOrGetter<ContextmenuList>) {
  const visible = ref(false)
  const position = ref<ContextmenuPosition>({ x: 0, y: 0 })
  const feature = ref<FeatureLike | undefined>()
  const options = ref<ContextmenuOptions>([])
  const coordinate = ref<Coordinate>()

  let currentMap: OLMap | undefined

  /** 递归过滤可见菜单并排序 */
  function filterAndSortMenu(
    menus: ContextmenuList,
    params: ContextmenuItemParams,
  ): ContextmenuOptions {
    const options: ContextmenuOptions = []
    menus
      .filter((item) => {
        const visible = item.visible
        if (typeof visible === 'function') {
          return visible(params)
        }
        return visible ?? true
      })
      .filter(item => !item.children || item.children.length > 0)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach((item) => {
        const icon = item.icon
        const label = item.label
        options.push({
          ...item,
          children: item.children ? filterAndSortMenu(item.children, params) : undefined,
          visible: true,
          action: () => {
            item.action?.(params)
            hide()
          },
          icon: typeof icon === 'function' ? () => icon(params) : icon,
          label: typeof label === 'function' ? () => label(params) : label,
          disabled: typeof item.disabled === 'function' ? item.disabled(params) : item.disabled ?? false,
        })
      })

    return options
  }

  function show(evt: MouseEvent) {
    evt.preventDefault()
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

    feature.value = foundFeature
    const [x, y] = [evt.clientX, evt.clientY]
    position.value = { x, y }
    options.value = filterAndSortMenu(toValue(items), {
      map: currentMap,
      position: { ...position.value },
      coordinate: _coordinate,
      feature: foundFeature,
      layer: foundLayer,
    })
    visible.value = true
  }

  function hide() {
    visible.value = false
  }

  /** 绑定 / 解绑事件 */
  function bindMapEvents(map?: OLMap) {
    if (!map)
      return
    const el = map.getViewport()
    el.addEventListener('contextmenu', show)
    el.addEventListener('click', hide)
  }

  function unbindMapEvents(map?: OLMap) {
    if (!map)
      return
    const el = map.getViewport()
    el.removeEventListener('contextmenu', show)
    el.removeEventListener('click', hide)
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
    feature: computed(() => feature.value),
    options: computed(() => options.value),
    coordinate: computed(() => coordinate.value),
    hide,
  }
}

export type UseContextmenuReturn = ReturnType<typeof useContextmenu>
export type UseContextmenuParams = Parameters<typeof useContextmenu>
export type UseContextmenuFn = (...args: UseContextmenuParams) => UseContextmenuReturn
