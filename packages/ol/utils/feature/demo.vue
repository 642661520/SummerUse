<script lang="ts" setup>
import { createCircleFeature, createLineStringFeature, createMultiLineStringFeature, createMultiPointFeature, createMultiPolygonFeature, createOpenStreetMapLayer, createPointFeature, createPolygonFeature, createStyle, createVectorLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const osmLayer = createOpenStreetMapLayer()
olMap.addLayer(osmLayer)
const { source, layer } = createVectorLayer({
  style: (feature) => {
    const name = feature.get('name')
    return createStyle({
      circleOptions: {
        radius: 10,
        fillOptions: { color: 'red' },
        strokeOptions: { color: 'black', width: 4 },
      },
      fillOptions: { color: 'green' },
      strokeOptions: {
        color: 'blue',
        width: 5,
        lineDash: [10, 10],
      },
      textOptions: {
        text: name,
        font: '20px Calibri,sans-serif',
        padding: [5, 5, 5, 5],
        offsetY: 30,
        fillOptions: { color: 'red' },
        strokeOptions: { color: 'black', width: 4 },
        backgroundFillOptions: { color: 'rgb(255, 255, 255)' },
        backgroundStrokeOptions: { color: 'rgb(0, 0, 0)', width: 4 },
      },
    })
  },
})
olMap.addLayer(layer)

// 单几何要素
const point = createPointFeature([120, 30], { name: 'point' })
source.addFeature(point)

const line = createLineStringFeature([[120.1, 30.1], [120.2, 30.2]], { name: 'line' })
source.addFeature(line)

const polygon = createPolygonFeature([[[120.11, 30.15], [120.15, 30.25], [120.1, 30.2], [120.11, 30.15]]], { name: 'polygon' })
source.addFeature(polygon)

const circle = createCircleFeature([120.4, 30.12], 0.1, { name: 'circle' })
source.addFeature(circle)

// 多几何要素
const multiPoint = createMultiPointFeature([[119.5, 29.8], [119.6, 29.9], [119.7, 29.85]], { name: 'multiPoint' })
source.addFeature(multiPoint)

const multiLine = createMultiLineStringFeature([
  [[119.8, 30.2], [119.9, 30.3]],
  [[119.85, 30.25], [119.95, 30.35]],
], { name: 'multiLine' })
source.addFeature(multiLine)

const multiPolygon = createMultiPolygonFeature([
  [[[119.4, 30.4], [119.5, 30.5], [119.35, 30.45], [119.4, 30.4]]],
  [[[119.6, 30.55], [119.7, 30.65], [119.55, 30.6], [119.6, 30.55]]],
], { name: 'multiPolygon' })
source.addFeature(multiPolygon)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
