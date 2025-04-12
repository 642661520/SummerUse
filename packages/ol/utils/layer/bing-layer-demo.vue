<script lang="ts" setup>
import { EPSG_4326, getBingLayer, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const bingLayer = getBingLayer({
  key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
  name: 'RoadOnDemand',
})
olMap.addLayer(bingLayer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-300px" />
</template>
