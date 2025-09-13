<script lang="ts" setup>
import { createCesiumViewer, getTianDiTuLayer, useSwitchBaseLayer } from '@summeruse/cesium'
import { NSelect } from 'naive-ui'
import { shallowRef } from 'vue'

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container)

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
</script>

<template>
  <NSelect v-model:value="visibleLayerName" :options />
  <div ref="container" class="w-100% h-300px" />
</template>
