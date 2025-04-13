<script lang="ts" setup>
import { Viewer } from 'cesium'
import { shallowRef, watchEffect } from 'vue'
import { getTianDiTuLayer } from '.'

const viewer = shallowRef<Viewer>()

const cesiumRef = shallowRef<HTMLElement>()

watchEffect(() => {
  if (cesiumRef.value) {
    viewer.value = new Viewer(cesiumRef.value, {
      baseLayer: undefined,
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
    const layer = getTianDiTuLayer({
      type: 'img',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
    })

    const label = getTianDiTuLayer({
      type: 'cia',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
    })
    viewer.value.imageryLayers.add(layer)
    viewer.value.imageryLayers.add(label)
  }
})
</script>

<template>
  <div ref="cesiumRef" />
</template>
