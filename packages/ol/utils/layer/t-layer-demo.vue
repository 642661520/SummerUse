<script lang="ts" setup>
import { EPSG_3857, EPSG_4326, getTianDiTuLayer, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const layer = getTianDiTuLayer({
  type: 'img',
  key: '8a684acb7b9d38ba08adf8035d0262ee',
  projection: EPSG_3857,
})
const label = getTianDiTuLayer({
  type: 'cia',
  key: '8a684acb7b9d38ba08adf8035d0262ee',
  projection: EPSG_3857,
})
olMap.addLayer(layer)
olMap.addLayer(label)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-300px" />
</template>
