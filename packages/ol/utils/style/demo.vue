<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Feature, Map as OLMap } from 'ol';
  import { OlMap, getOSMLayer, EPSG_4326, createVectorLayer } from '@summeruse/ol';
  import { createStyle } from '.';
  import { LineString, Point, Polygon } from 'ol/geom';
  const olMap = new OLMap();
  const osmLayer = getOSMLayer();
  olMap.addLayer(osmLayer);
  const { source, layer } = createVectorLayer({
    style: createStyle({
      circleOptions: {
        radius: 10,
        fillOptions: {
          color: 'red'
        },
        strokeOptions: {
          color: 'black',
          width: 4
        }
      },
      fillOptions: {
        color: 'green',
      },
      strokeOptions: {
        color: 'blue',
        width: 5,
        lineDash: [10, 10],
      },
      textOptions: {
        text: 'hello',
        font: '20px Calibri,sans-serif',
        padding: [5, 5, 5, 5],
        offsetY: 30,
        fillOptions: {
          color: 'red',
        },
        strokeOptions: {
          color: 'black',
          width: 4
        },
        backgroundFillOptions: {
          color: 'rgb(255, 255, 255)',
        },
        backgroundStrokeOptions: {
          color: 'rgb(0, 0, 0)',
          width: 4,
        },
      }
    })
  });
  olMap.addLayer(layer);
  const point = new Feature({
    geometry: new Point([120, 30]),
  })
  source.addFeature(point);

  const line = new Feature({
    geometry: new LineString([[120.1, 30.1], [120.2, 30.2]]),
  })
  source.addFeature(line);

  const polygon = new Feature({
    geometry: new Polygon([[[120.11, 30.15], [120.15, 30.25], [120.1, 30.2], [120.11, 30.15]]]),
  });
  source.addFeature(polygon);
</script>