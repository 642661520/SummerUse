<script setup lang="ts">
  import { NOlContextmenu, getTianDiTuLayer, EPSG_3857, createVectorLayer } from '@summeruse/ol';
  import type { Pixel } from 'ol/pixel';
  import type { Coordinate } from 'ol/coordinate';
  import type { FeatureLike } from 'ol/Feature';
  import { OlMap, } from '@summeruse/ol';
  import type { OlMapInst } from '@summeruse/ol';
  import { computed, onMounted, ref } from 'vue';
  import Feature from 'ol/Feature';
  import { Point } from 'ol/geom';
  const createOptions = (data: {
    event: MouseEvent;
    pixel: Pixel;
    coordinate: Coordinate;
    features: FeatureLike[];
  }) => {

    if (data.features.length) {
      const feature = data.features[0];
      const type = feature.get('type');
      if (type === 'point') {
        return [
          {
            key: 'point',
            label: 'point',
            onClick: () => {
              alert(type);
            }
          },
          {
            key: 'remove-point',
            label: '删除点',
            onClick: () => {
              source.removeFeature(feature as Feature);
            }
          }
        ]
      }
    }

    return [
      {
        key: 'add',
        label: '添加点',
        onClick: () => {
          source.addFeature(new Feature({
            geometry: new Point(data.coordinate),
            type: 'point',
          }))
        }
      },
      {
        key: '1',
        label: '1',
        children: [
          {
            key: '1-1',
            label: '1-1',
            onClick: () => {
              console.log('1-1', data);
            }
          },
          {
            key: '1-2',
            label: '1-2',
            onClick: () => {
              console.log('1-2');
            }
          },
        ],
      }
    ]
  }

  const olMapRef = ref<OlMapInst>();

  const olMap = computed(() => {
    return olMapRef.value?.olMap;
  });

  const { source, layer } = createVectorLayer();

  const feature = new Feature({
    geometry: new Point([0, 0]),
    type: 'point',
  })
  source.addFeature(feature);

  onMounted(() => {
    olMap.value?.addLayer(getTianDiTuLayer({
      type: 'img',
      key: '8a684acb7b9d38ba08adf8035d0262ee',
      projection: EPSG_3857,
    }));
    olMap.value?.addLayer(layer);
  });
</script>

<template>
  <OlMap ref="olMapRef" class="w-100% h-400px">
    <template #default="{ olMap }">
      <NOlContextmenu :createOptions v-if="olMap" :olMap></NOlContextmenu>
    </template>
  </OlMap>
</template>