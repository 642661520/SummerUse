<script lang="ts" setup>
import { EPSG_4326, getOSMLayer, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const osmLayer = getOSMLayer()
olMap.addLayer(osmLayer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
