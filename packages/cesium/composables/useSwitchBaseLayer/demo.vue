<script lang="ts" setup>
import { getTianDiTuLayer, useSwitchBaseLayer } from '@summeruse/cesium'

import { Viewer } from 'cesium'
import { NSelect } from 'naive-ui'
import { shallowRef, watchEffect } from 'vue'

const div = document.createElement('div')
div.style.width = '100%'
div.style.height = '100%'

const iconContainer = document.createElement('div')
iconContainer.style.display = 'none'

const viewer = new Viewer(div, {
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
  creditContainer: iconContainer,
})

const key = '8a684acb7b9d38ba08adf8035d0262ee'

const layers = {
  影像: [getTianDiTuLayer({
    type: 'img',
    key,
  }), getTianDiTuLayer({
    type: 'cia',
    key,
  })],
  矢量: [getTianDiTuLayer({
    type: 'vec',
    key,
  }), getTianDiTuLayer({
    type: 'cta',
    key,
  })],
  地形: [getTianDiTuLayer({
    type: 'ter',
    key,
  }), getTianDiTuLayer({
    type: 'cva',
    key,
  })],
}

const options = Object.keys(layers).map(key => ({
  value: key,
  label: key,
}))

const { visibleLayerName } = useSwitchBaseLayer({
  viewer,
  layers,
})

const cesiumRef = shallowRef<HTMLElement>()

watchEffect(() => {
  if (cesiumRef.value) {
    cesiumRef.value.appendChild(div)
  }
})
</script>

<template>
  <NSelect v-model:value="visibleLayerName" :options />
  <div ref="cesiumRef" class="w-100% h-300px" />
</template>
