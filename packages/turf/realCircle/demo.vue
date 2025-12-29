<script lang="ts" setup>
import { createOpenStreetMapLayer, EPSG_4326ToEPSG_3857, OlMap } from '@summeruse/ol'
import { getRealCircleCoordinates } from '@summeruse/turf'
import { Feature, Map as OLMap } from 'ol'
import { Polygon } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

const olMap = new OLMap()
const center = [120, 30]
const formatCenter = EPSG_4326ToEPSG_3857(center)
const circleCoordinates = getRealCircleCoordinates(
  center,
  100000,
  100,
)

const source = new VectorSource({
  features: [
    new Feature({
      geometry: new Polygon([circleCoordinates[0].map(item => EPSG_4326ToEPSG_3857(item))]),
    }),
  ],
})
const layer = new VectorLayer({
  source,
  zIndex: 2,
})
olMap.addLayer(createOpenStreetMapLayer())
olMap.addLayer(layer)
</script>

<template>
  <OlMap :ol-map class="w-100% h-300px" show-zoom :center="formatCenter" :zoom="6" />
</template>
