import type { ImageryLayer, Viewer } from 'cesium'
import { ref, watch } from 'vue'

export function useSwitchBaseLayer(data: {
  viewer: Viewer
  defaultLayerName?: string
  layers: {
    [key: string]: ImageryLayer[]
  }
}) {
  const visibleLayerName = ref(data.defaultLayerName || Object.keys(data.layers)[0])
  Object.values(data.layers).forEach((list) => {
    list.forEach((layer) => {
      data.viewer.imageryLayers.add(layer)
    })
  })

  watch(
    visibleLayerName,
    () => {
      Object.entries(data.layers).forEach(([name, list]) => {
        const visible = name === visibleLayerName.value
        list.forEach((layer) => {
          layer.show = visible
        })
      })
    },
    {
      immediate: true,
    },
  )

  return { visibleLayerName }
}
