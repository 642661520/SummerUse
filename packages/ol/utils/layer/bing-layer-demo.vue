<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-300px"></OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap, View } from 'ol';
  import { OlMap, getBingLayer, EPSG_4326 } from '@summeruse/ol';

  const olMap = new OLMap();
  const bingLayer = getBingLayer({
    key: 'AtmBUmOPFg6c61ynLhIbjvrKfuXkMw1lCMTlLh9ALY47Llyetb6lgyRMitoPxKZo',
    name: 'RoadOnDemand',
  });
  olMap.addLayer(bingLayer);
</script>