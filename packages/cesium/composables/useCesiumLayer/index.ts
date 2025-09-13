import type { Viewer } from 'cesium'

import { tryOnScopeDispose } from '@vueuse/core'
import { CustomDataSource } from 'cesium'

export function useCesiumLayer({
  name,
  viewer,
}: {
  name: string
  viewer: Viewer
}) {
  const layer = new CustomDataSource(name)

  viewer.dataSources.add(layer)

  tryOnScopeDispose(() => {
    viewer.dataSources.remove(layer)
  })

  const destroy = () => {
    viewer.dataSources.remove(layer)
  }

  return { layer, destroy }
}
