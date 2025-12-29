<script lang="ts" setup>
import { createOpenStreetMapLayer, OlMap, useGraticule } from '@summeruse/ol'
import { NButton } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { computed } from 'vue'

const olMap = new OLMap()
const layer = createOpenStreetMapLayer()
olMap.addLayer(layer)
const { showGraticule: showGraticule1 } = useGraticule({
  olMap,
  graticuleOptions: {
    maxLines: 20,
    strokeStyleOption: {
      color: '#6f42c1',
      width: 1,
      lineDash: [10, 10],
    },
    showLabels: true,

  },
  defaultShow: true,
})

const { showGraticule: showGraticule2 } = useGraticule({
  olMap,
  graticuleOptions: {
    lonLabelPosition: 1,
    latLabelPosition: 0,
    latLabelStyleOption: {
      font: '12px Calibri,sans-serif',
      textAlign: 'left',
      strokeOptions: {
        color: 'rgba(255,255,255,1)',
        width: 3,
      },
    },
    lonLabelStyleOption: {
      font: '12px Calibri,sans-serif',
      textBaseline: 'top',
      strokeOptions: {
        color: 'rgba(255,255,255,1)',
        width: 3,
      },
    },
    showLabels: true,
    opacity: 0,
  },
  defaultShow: true,
})

const showGraticule = computed({
  get: () => showGraticule1.value || showGraticule2.value,
  set: (val) => {
    showGraticule1.value = val
    showGraticule2.value = val
  },
})
</script>

<template>
  <NButton @click="showGraticule = !showGraticule">
    {{
      showGraticule ? '隐藏' : '显示'
    }}
  </NButton>
  <OlMap :ol-map class="h-400px w-400px" />
</template>
