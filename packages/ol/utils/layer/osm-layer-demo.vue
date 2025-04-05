<template>
  <OlMap :ol-map class="w-100% h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap, View } from 'ol';
  import { OlMap, getOSMLayer } from '@summeruse/ol';
  const olMap = new OLMap({
    view: new View({
      center: [120, 30],
      zoom: 16,
      projection: 'EPSG:4326',
    }),
    layers: [
      getOSMLayer()
    ],
  });
</script>