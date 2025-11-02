import type { ViewerOptions } from '@/components/cesium-viewer/props'
import type { MaybeRefOrGetter } from 'vue'
import { cesiumViewerInjectionKey } from '@/components/cesium-viewer/props'
import { Viewer } from 'cesium'
import { provide, toValue, watchEffect } from 'vue'

export function createCesiumViewer(element: MaybeRefOrGetter<HTMLElement | undefined>, options?: ViewerOptions) {
  const div = document.createElement('div')
  div.style.width = '100%'
  div.style.height = '100%'

  const iconContainer = document.createElement('div')
  iconContainer.style.display = 'none'

  const viewer = new Viewer(div, {
    creditContainer: iconContainer,
    baseLayer: false,
    shouldAnimate: true,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    timeline: false,
    animation: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    scene3DOnly: true,
    ...options,
  })

  watchEffect(() => {
    const el = toValue(element)
    if (el) {
      el.appendChild(div)
    }
  })

  provide(cesiumViewerInjectionKey, viewer)

  return { viewer }
}
