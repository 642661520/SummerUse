<script lang="ts" setup>
import { createXYZLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()

// 使用 CartoDB 浅色底图（免费，无需 key）
const xyzLayer = createXYZLayer({
  sourceOptions: {
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    projection: EPSG_4326,
  },
})
olMap.addLayer(xyzLayer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
