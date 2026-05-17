<script lang="ts" setup>
import { createPMTilesLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()

// 使用 protomaps 公开示例 PMTiles 文件（佛罗伦萨矢量地图）
const pmtilesLayer = createPMTilesLayer({
  url: 'https://air.mtn.tw/flowers.pmtiles',
})
olMap.addLayer(pmtilesLayer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[121.525398, 25.014998]" :zoom="13" class="w-100% h-400px" />
</template>
