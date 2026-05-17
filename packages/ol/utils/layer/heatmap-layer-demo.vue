<script lang="ts" setup>
import { createHeatmapLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Feature, Map as OLMap } from 'ol'
import { Point } from 'ol/geom'

const olMap = new OLMap()

// 生成随机热力点
const points: Feature<Point>[] = []
// 中心区域密集
for (let i = 0; i < 50; i++) {
  const lon = 120 + (Math.random() - 0.5) * 2
  const lat = 30 + (Math.random() - 0.5) * 2
  const feature = new Feature({
    geometry: new Point([lon, lat]),
    weight: Math.random(),
  })
  points.push(feature)
}
// 外围稀疏点
for (let i = 0; i < 20; i++) {
  const lon = 120 + (Math.random() - 0.5) * 5
  const lat = 30 + (Math.random() - 0.5) * 5
  const feature = new Feature({
    geometry: new Point([lon, lat]),
    weight: Math.random() * 0.5,
  })
  points.push(feature)
}

const { layer, source } = createHeatmapLayer({
  blur: 20,
  radius: 15,
  weight: 'weight',
})
source.addFeatures(points)
olMap.addLayer(layer)
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
