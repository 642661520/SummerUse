<template>
  <OlMap :olMap class="w-100% h-300px" showZoom :center="formatCenter" :zoom="6"></OlMap>
</template>
<script lang="ts" setup>
  import { Feature, Map as OLMap, View } from 'ol';
  import { OlMap, getOSMLayer, getRealCircleCoordinates, wgs84ToMercator } from '@summeruse/ol';
  import VectorSource from 'ol/source/Vector';
  import { Polygon } from 'ol/geom';
  import VectorLayer from 'ol/layer/Vector';
  const olMap = new OLMap();
  const center = [120, 30];
  const formatCenter = wgs84ToMercator(center);
  const circleCoordinates = getRealCircleCoordinates(
    center,
    100000,
    100,
  );

  const source = new VectorSource({
    features: [
      new Feature({
        geometry: new Polygon([circleCoordinates[0].map((item) => wgs84ToMercator(item))]),
      }),
    ],
  });
  const layer = new VectorLayer({
    source,
    zIndex: 2,
  });
  olMap.addLayer(getOSMLayer());
  olMap.addLayer(layer);

</script>