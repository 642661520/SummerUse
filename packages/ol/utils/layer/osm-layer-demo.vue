<script lang="ts" setup>
import { createOpenStreetMapLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const osmLayer = createOpenStreetMapLayer()
olMap.addLayer(osmLayer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
