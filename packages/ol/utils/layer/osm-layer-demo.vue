<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap } from 'ol';
  import { OlMap, getOSMLayer, EPSG_4326 } from '@summeruse/ol';
  const olMap = new OLMap();
  const osmLayer = getOSMLayer();
  olMap.addLayer(osmLayer);
</script>