<script lang="ts" setup>
import { createWebGLVectorLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Feature, Map as OLMap } from 'ol'
import { Point } from 'ol/geom'

const olMap = new OLMap()

interface PointData {
  name: string
  color: string
  size: number
}

const features: Feature<Point>[] = [
  { name: '北京', lon: 116.39, lat: 39.91, color: '#e74c3c', size: 20 },
  { name: '上海', lon: 121.47, lat: 31.23, color: '#3498db', size: 16 },
  { name: '广州', lon: 113.26, lat: 23.13, color: '#2ecc71', size: 14 },
  { name: '成都', lon: 104.07, lat: 30.57, color: '#f39c12', size: 14 },
  { name: '武汉', lon: 114.30, lat: 30.60, color: '#9b59b6', size: 12 },
].map((d) => {
  return new Feature<Point>({
    geometry: new Point([d.lon, d.lat]),
    name: d.name,
    color: d.color,
    size: d.size,
  })
})

const { source, layer } = createWebGLVectorLayer({
  style: {
    'circle-radius': ['get', 'size'],
    'circle-fill-color': ['get', 'color'],
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 2,
    'circle-opacity': 0.85,
  },
  sourceOptions: {
    features,
  },
})
olMap.addLayer(layer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[115, 32]" :zoom="5" class="w-100% h-400px" />
</template>
