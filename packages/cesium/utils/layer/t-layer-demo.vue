<script lang="ts" setup>
import { createCesiumViewer, createTianDiTuLayer } from '@summeruse/cesium'
import { shallowRef } from 'vue'

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container)

const layer = createTianDiTuLayer({
  type: 'img',
  key: '8a684acb7b9d38ba08adf8035d0262ee',
})

const label = createTianDiTuLayer({
  type: 'cia',
  key: '8a684acb7b9d38ba08adf8035d0262ee',
})
viewer.imageryLayers.add(layer)
viewer.imageryLayers.add(label)
</script>

<template>
  <div ref="container" class="w-100% h-300px" />
</template>
