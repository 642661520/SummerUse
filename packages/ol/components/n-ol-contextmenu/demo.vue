<script setup lang="ts">
  import { Map as OLMap, View } from 'ol'
  import TileLayer from 'ol/layer/Tile';
  import { OSM } from 'ol/source';
  import { NOlContextmenu } from '@summeruse/ol';
  import { onMounted, ref, shallowRef } from 'vue';
  import type { Pixel } from 'ol/pixel';
  import type { Coordinate } from 'ol/coordinate';
  import type { FeatureLike } from 'ol/Feature';
  import 'ol/ol.css';
  const mapRef = ref<HTMLDivElement>();
  const olMap = shallowRef<OLMap>();
  onMounted(() => {
    olMap.value = new OLMap({
      target: mapRef.value,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })
  })
  const createDropdownOptions = (data: {
    event: MouseEvent;
    pixel: Pixel;
    coordinate: Coordinate;
    features: FeatureLike[];
  }) => {
    return [
      {
        key: '1',
        label: '1',
        type: 'group',
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

</script>

<template>
  <div ref="mapRef" class="w-100% h-400px">
    <NOlContextmenu :createDropdownOptions v-if="olMap" :olMap></NOlContextmenu>
  </div>
</template>