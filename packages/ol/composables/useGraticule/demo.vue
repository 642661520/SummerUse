<script lang="ts" setup>
import { createOpenStreetMapLayer, OlMap, useGraticule } from '@summeruse/ol'
import { NButton } from 'naive-ui'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const layer = createOpenStreetMapLayer()
olMap.addLayer(layer)
const { showGraticule } = useGraticule({
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
</script>

<template>
  <NButton @click="showGraticule = !showGraticule">
    {{
      showGraticule ? '隐藏' : '显示'
    }}
  </NButton>
  <OlMap :ol-map class="h-400px w-400px" />
</template>
