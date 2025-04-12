<script lang="ts" setup>
import { EPSG_3857, getBingLayer, getOSMLayer, getTianDiTuLayer, OlMap } from '@summeruse/ol'
import { NSelect } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { useSwitchBaseLayer } from '.'

const olMap = new OLMap()

const layers = {
  osm: [getOSMLayer()],
  bing: [getBingLayer({
    key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
    name: 'RoadOnDemand',
  })],
  天地图卫星图: [
    getTianDiTuLayer({
      type: 'img',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    }),
    getTianDiTuLayer({
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
</script>

<template>
  <NSelect
    v-model:value="visibleLayerName" class="w-200px" :options="[{
                                                                  value: 'osm',
                                                                  label: 'osm',
                                                                }, {
                                                                  value: 'bing',
                                                                  label: 'bing',
                                                                },
                                                                {
                                                                  value: '天地图卫星图',
                                                                  label: '天地图卫星图',
                                                                },
    ]"
  />
  <OlMap :ol-map class="w-100% h-400px" />
</template>
