<script lang="ts" setup>
import type { CesiumViewerProps } from './props'
import { Viewer } from 'cesium'
import { provide, shallowRef, watchEffect } from 'vue'
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

const div = document.createElement('div')
div.style.width = '100%'
div.style.height = '100%'

const iconContainer = document.createElement('div')
iconContainer.style.display = 'none'

const viewer = new Viewer(div, {
  creditContainer: iconContainer,
  ...props.viewerOptions,
})

const cesiumRef = shallowRef<HTMLElement>()

watchEffect(() => {
  if (cesiumRef.value) {
    cesiumRef.value.appendChild(div)
  }
})

defineExpose({
  viewer,
})

provide(cesiumViewerInjectionKey, viewer)
</script>

<template>
  <div ref="cesiumRef" class="su-cesium-viewer">
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
