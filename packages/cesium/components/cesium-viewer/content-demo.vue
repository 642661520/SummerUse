<script lang="ts" setup>
import type { Viewer } from 'cesium'
import { createTianDiTuLayer, useCesiumViewer } from '@summeruse/cesium'
import { Cartesian3 } from 'cesium'

const props = defineProps<{
  viewer: Viewer
}>()
const { viewer } = props // props 获取 viewer

viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(116.397428, 39.90923, 2000000.0),
  orientation: {
    heading: 0,
    pitch: -Math.PI / 4,
    roll: 0,
  },
})

const viewer2 = useCesiumViewer()! // useCesiumViewer 获取 viewer

const layer = createTianDiTuLayer({
  type: 'img',
  key: '8a684acb7b9d38ba08adf8035d0262ee',
})

viewer2.imageryLayers.add(layer)
</script>

<template>
  <div />
</template>
