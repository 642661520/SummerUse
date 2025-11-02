<script setup lang="ts">
import { createCesiumViewer, createOpenStreetMapLayer } from '@summeruse/cesium'
import { shallowRef } from 'vue'

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container)
const layer = createOpenStreetMapLayer()
viewer.imageryLayers.add(layer)
</script>

<template>
  <div ref="container" class="w-100% h-300px" />
</template>
