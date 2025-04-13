<script lang="ts" setup>
import { Viewer } from 'cesium'
import { shallowRef, watchEffect } from 'vue'
import { getOSMLayer } from '.'

const viewer = shallowRef<Viewer>()

const cesiumRef = shallowRef<HTMLElement>()

watchEffect(() => {
  if (cesiumRef.value) {
    viewer.value = new Viewer(cesiumRef.value, {
      baseLayer: false,
      imageryProviderViewModels: undefined,
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
    })
    const layer = getOSMLayer()
    viewer.value.imageryLayers.add(layer)
  }
})
</script>

<template>
  <div ref="cesiumRef" />
</template>
