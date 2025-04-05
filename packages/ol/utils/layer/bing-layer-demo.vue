<template>
  <OlMap :ol-map class="w-100% h-300px"></OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap, View } from 'ol';
  import { OlMap, getBingLayer } from '@summeruse/ol';

  const olMap = new OLMap({
    view: new View({
      center: [120, 30],
      zoom: 16,
      projection: 'EPSG:4326',
    }),
    layers: [getBingLayer({
      key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
      name: 'RoadOnDemand',
    })],
  });
</script>