<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px">
  </OlMap>
</template>
<script lang="ts" setup>
  import { Map as OLMap } from 'ol';
  import { OlMap, getOSMLayer, EPSG_4326, createVectorLayer, createStyle, createLineStringFeature, createPointFeature, createCircleFeature, createPolygonFeature } from '@summeruse/ol';
  const olMap = new OLMap();
  const osmLayer = getOSMLayer();
  olMap.addLayer(osmLayer);
  const { source, layer } = createVectorLayer({
    style: (feature) => {
      const name = feature.get('name');
      return createStyle({
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
          text: name,
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
    }
  });
  olMap.addLayer(layer);
  const point = createPointFeature([120, 30], {
    name: 'point'
  });

  source.addFeature(point);

  const line = createLineStringFeature([[120.1, 30.1], [120.2, 30.2]], {
    name: 'line'
  });
  source.addFeature(line);

  const polygon = createPolygonFeature([[[120.11, 30.15], [120.15, 30.25], [120.1, 30.2], [120.11, 30.15]]], {
    name: 'polygon'
  });
  source.addFeature(polygon);

  const circle = createCircleFeature([120.4, 30.12], 0.1, {
    name: 'circle'
  });
  source.addFeature(circle);
</script>