import type { Map as OLMap } from 'ol'
import type TileLayer from 'ol/layer/Tile'
import { ref, watch } from 'vue'

export function useSwitchBaseLayer(data: {
  olMap: OLMap
  defaultLayerName?: string
  layers: {
    [key: string]: TileLayer[]
  }
}) {
  const visibleLayerName = ref(data.defaultLayerName || Object.keys(data.layers)[0])
  Object.values(data.layers).forEach((list) => {
    list.forEach((layer) => {
      data.olMap.addLayer(layer)
    })
  })

  watch(
    visibleLayerName,
    () => {
      Object.entries(data.layers).forEach(([name, list]) => {
        const visible = name === visibleLayerName.value
        list.forEach((layer) => {
          layer.setVisible(visible)
        })
      })
    },
    {
      immediate: true,
    },
  )

  return { visibleLayerName }
}
