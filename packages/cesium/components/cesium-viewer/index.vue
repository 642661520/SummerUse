<script lang="ts" setup>
import type { CesiumViewerProps } from './props'

import { createCesiumViewer } from '@summeruse/cesium'
import { provide, shallowRef } from 'vue'
import { cesiumViewerInjectionKey } from './props'

const props = withDefaults(defineProps<CesiumViewerProps>(), {
  viewerOptions: () => ({
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
  }),
})

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container, props.viewerOptions)

defineExpose({
  viewer,
})

provide(cesiumViewerInjectionKey, viewer)
</script>

<template>
  <div ref="container" class="su-cesium-viewer">
    <div class="su-cesium-viewer__container">
      <slot :viewer />
    </div>
  </div>
</template>

<style lang="scss">
  .su-cesium-viewer {
    position: relative;

    .su-cesium-viewer__container {
      position: absolute;
    }
  }
</style>
