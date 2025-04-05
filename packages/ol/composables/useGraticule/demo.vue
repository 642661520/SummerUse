<template>
  <NButton @click="showGraticule = !showGraticule">{{
    showGraticule ? '隐藏' : '显示'
  }}</NButton>
  <OlMap :ol-map class="w-400px h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap, View } from 'ol';
  import { OlMap, useGraticule } from '@summeruse/ol';
  import { OSM } from 'ol/source';
  import TileLayer from 'ol/layer/Tile';
  import { NButton } from 'naive-ui';
  const olMap = new OLMap({
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
  });
  const { showGraticule } = useGraticule({ olMap, defaultShow: true });
</script>