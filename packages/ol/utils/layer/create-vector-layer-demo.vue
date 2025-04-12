<script lang="ts" setup>
import { createVectorLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Feature, Map as OLMap } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'

const olMap = new OLMap()
const { source, layer } = createVectorLayer()
olMap.addLayer(layer)
const point = new Feature({
  geometry: new Point([120, 30]),
})
source.addFeature(point)

const line = new Feature({
  geometry: new LineString([[120.1, 30.1], [120.2, 30.2]]),
})
source.addFeature(line)

const polygon = new Feature({
  geometry: new Polygon([[[120.11, 30.15], [120.15, 30.25], [120.1, 30.2], [120.11, 30.15]]]),
})
source.addFeature(polygon)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
