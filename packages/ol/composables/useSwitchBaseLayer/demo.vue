<template>
  <NSelect v-model:value="visibleLayerName" class="w-200px" :options="[{
    value: 'osm',
    label: 'osm'
  }, {
    value: 'bing',
    label: 'bing'
  },
  {
    value: '天地图卫星图',
    label: '天地图卫星图',
  }
  ]"></NSelect>
  <OlMap :ol-map class="w-100% h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap } from 'ol';
  import { EPSG_3857, OlMap, getBingLayer, getOSMLayer, getTianDiTuLayer } from '@summeruse/ol';
  import { useSwitchBaseLayer } from '.'
  import { NSelect } from 'naive-ui';
  const olMap = new OLMap();

  const layers = {
    'osm': [getOSMLayer()],
    'bing': [getBingLayer({
      key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
      name: 'RoadOnDemand',
    })],
    '天地图卫星图': [
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
    ]
  }

  const { visibleLayerName } = useSwitchBaseLayer({
    defaultLayerName: 'osm',
    olMap,
    layers
  })

</script>