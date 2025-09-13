<script setup lang="ts">
import { createCesiumViewer, getOSMLayer } from '@summeruse/cesium'
import { shallowRef } from 'vue'

const container = shallowRef<HTMLDivElement>()
const { viewer } = createCesiumViewer(container)
const layer = getOSMLayer()
viewer.imageryLayers.add(layer)
</script>

<template>
  <div ref="container" class="w-100% h-300px" />
</template>
