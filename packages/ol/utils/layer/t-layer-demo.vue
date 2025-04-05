<template>
  <OlMap :ol-map class="w-100% h-300px"></OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap, View } from 'ol';
  import { OlMap, getTianDiTuLayer, EPSG_4326, EPSG_3857 } from '@summeruse/ol';

  const olMap = new OLMap({
    view: new View({
      center: [120, 30],
      zoom: 16,
      projection: EPSG_4326,
    }),
    layers: [getTianDiTuLayer({
      type: 'img',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    }),
    getTianDiTuLayer({
      type: 'cia',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    })
    ],
  });
</script>