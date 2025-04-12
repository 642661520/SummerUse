<script lang="ts" setup>
import { getOSMLayer, OlMap, useGraticule } from '@summeruse/ol'
import { NButton } from 'naive-ui'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()
const layer = getOSMLayer()
olMap.addLayer(layer)
const { showGraticule } = useGraticule({ olMap, defaultShow: true })
</script>

<template>
  <NButton @click="showGraticule = !showGraticule">
    {{
      showGraticule ? '隐藏' : '显示'
    }}
  </NButton>
  <OlMap :ol-map class="h-400px w-400px" />
</template>
