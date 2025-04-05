<template>
  <OlMap ref="olMapInst" class="w-100% h-400px" :zoom="10" :olMap></OlMap>
  {{ coordinates }}
</template>
<script lang="ts" setup>
  import { getOSMLayer, OlMap } from '@summeruse/ol';
  import type { OlMapInst } from '@summeruse/ol';
  import { onMounted, ref } from 'vue';
  import { Map as OLMap } from 'ol';
  import { drawLineString, useDrawLineString } from '.';
  import { Fill, Stroke, Style } from 'ol/style';
  import CircleStyle from 'ol/style/Circle';
  const olMapInst = ref<OlMapInst>();
  const olMap = new OLMap();
  olMap.addLayer(getOSMLayer());

  const { coordinates } = useDrawLineString(olMap, {

  })

  // onMounted(() => {
  //   drawLineString(olMap, {
  //     // size: 1,
  //     // defaultCoordinates: [[[0, 0], [5000, -10000], [10000, 10000]]],
  //     style: new Style({
  //       stroke: new Stroke({
  //         color: 'red',
  //         width: 2,
  //       }),
  //       fill: new Fill({
  //         color: 'rgba(255, 0, 0, 0.5)',
  //       }),
  //       image: new CircleStyle({
  //         radius: 5,
  //         fill: new Fill({
  //           color: 'red',
  //         }),
  //         stroke: new Stroke({
  //           color: 'white',
  //           width: 2,
  //         }),
  //       }),
  //     }),
  //   });
  // })
</script>