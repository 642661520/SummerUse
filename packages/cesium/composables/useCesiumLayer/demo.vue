<script setup lang="ts">
import { createCesiumViewer, getOSMLayer, useCesiumLayer } from '@summeruse/cesium'
import { Cartesian3, Color } from 'cesium'
import { shallowRef } from 'vue'

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container)
viewer.imageryLayers.add(getOSMLayer())

const { layer } = useCesiumLayer({
  name: 'custom',
  viewer,
})
layer.entities.add({
  position: Cartesian3.fromDegrees(114.305556, 22.627222, 100),
  ellipse: {
    semiMinorAxis: 100000,
    semiMajorAxis: 100000,
    material: Color.RED.withAlpha(0.5),
  },
})
viewer.flyTo(layer)
</script>

<template>
  <div ref="container" class="w-100% h-300px" />
</template>
