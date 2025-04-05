<script setup lang="ts">
  import { getOSMLayer } from '@summeruse/ol';
  import { OlMap } from '@summeruse/ol';
  import { computed, h, onMounted, ref } from 'vue';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import Feature from 'ol/Feature';
  import { Point, Polygon } from 'ol/geom';
  import NOlPointermove from './index.vue'
  import type { NOlPointermoveOptions, OlMapInst } from '@summeruse/ol';

  const olMapRef = ref<OlMapInst>();

  const olMap = computed(() => {
    return olMapRef.value?.olMap;
  });

  const source = new VectorSource();
  const layer = new VectorLayer({
    source,
  });

  const feature = new Feature({
    geometry: new Point([0, 0]),
    type: 'point',
    data: {
      name: '点'
    }
  })
  source.addFeature(feature);

  const feature2 = new Feature({
    geometry: new Polygon([
      [
        [1000000, 1000000],
        [1000000, 5000000],
        [5000000, 5000000],
        [5000000, 1000000],
      ]
    ]),
    type: 'polygon',
    data: {
      name: '多边形',
    }
  })
  source.addFeature(feature2);


  onMounted(() => {
    olMap.value?.addLayer(getOSMLayer());
    olMap.value?.addLayer(layer);
  });

  const createOptions = (data: NOlPointermoveOptions) => {
    if (data.features.length) {
      const feature = data.features[0];
      const type = feature.get('type');
      if (type === 'point') {
        return {
          showArrow: true,
          content: feature.get('data').name,
        }
      } else if (type === 'polygon') {
        return {
          showArrow: false,
          raw: true,
          content: h('div', {
            class: 'flex flex-col gap-2 bg-#bafc p-2 rounded-md',
          }, {
            default: () => [
              h('div', {
                class: 'flex items-center gap-2',
              }, {
                default: () => [
                  h('div', {
                    class: 'w-4 h-4 bg-#000'
                  }),
                  h('div', {
                    class: 'text-#000'
                  }, {
                    default: () => feature.get('data').name
                  })
                ]
              })
            ]
          })
        }
      }
    }
  }

</script>

<template>
  <OlMap ref="olMapRef" class="w-100% h-400px">
    <template #default="{ olMap }">
      <NOlPointermove v-if="olMap" :olMap :createOptions></NOlPointermove>
    </template>
  </OlMap>
</template>