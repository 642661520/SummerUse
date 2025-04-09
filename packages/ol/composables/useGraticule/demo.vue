<template>
  <NButton @click="showGraticule = !showGraticule">{{
    showGraticule ? '隐藏' : '显示'
  }}</NButton>
  <OlMap :ol-map class="w-400px h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap } from 'ol';
  import { getOSMLayer, OlMap, useGraticule } from '@summeruse/ol';
  import { NButton } from 'naive-ui';
  const olMap = new OLMap();
  const layer = getOSMLayer();
  olMap.addLayer(layer);
  const { showGraticule } = useGraticule({ olMap, defaultShow: true });
</script>