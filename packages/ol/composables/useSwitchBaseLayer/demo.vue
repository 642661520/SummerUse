<script lang="ts" setup>
import { EPSG_3857, createBingLayer, createOpenStreetMapLayer, createTianDiTuLayer, OlMap, useSwitchBaseLayer } from '@summeruse/ol'
import { NSelect } from 'naive-ui'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()

const layers = {
  osm: [createOpenStreetMapLayer()],
  bing: [createBingLayer({
    key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
    name: 'RoadOnDemand',
  })],
  天地图卫星图: [
    createTianDiTuLayer({
      type: 'img',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    }),
    createTianDiTuLayer({
      type: 'cia',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    }),
  ],
}

const { visibleLayerName } = useSwitchBaseLayer({
  defaultLayerName: 'osm',
  olMap,
  layers,
})

const options = Object.keys(layers).map(key => ({
  value: key,
  label: key,
}))
</script>

<template>
  <NSelect v-model:value="visibleLayerName" class="w-200px" :options />
  <OlMap :ol-map class="w-100% h-400px" />
</template>
