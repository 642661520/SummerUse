<script lang="ts" setup>
import type { ContextmenuItem } from '@summeruse/ol'
import type { Feature } from 'ol'
import { createOpenStreetMapLayer, createPointFeature, createPolygonFeature, createVectorLayer, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'
import { ref } from 'vue'
import Contextmenu from './a-ol-contextmenu-demo.vue'

const olMap = new OLMap()
const { source, layer } = createVectorLayer()

const feature = createPointFeature([0, 0], {
  type: 'point',
  data: {
    name: '点',
  },
})
source.addFeature(feature)

const feature2 = createPolygonFeature([
  [
    [1000000, 1000000],
    [1000000, 5000000],
    [5000000, 5000000],
    [5000000, 1000000],
  ],
], {
  type: 'polygon',
  data: {
    name: '多边形',
  },
})
source.addFeature(feature2)
olMap.addLayer(createOpenStreetMapLayer())
olMap.addLayer(layer)
const items = ref<ContextmenuItem[]>([
  {
    label: '添加点',
    key: 'add-point',
    visible: ({ feature }) => !feature,
    action: ({ coordinate }) => {
      const feature = createPointFeature(coordinate, {
        type: 'point',
        data: {
          name: '点',
        },
      })
      source.addFeature(feature)
    },
  },
  {
    label: '删除点',
    key: 'delete-point',
    visible: ({ feature }) => feature?.get('type') === 'point',
    action: ({ feature }) => {
      if (feature)
        source.removeFeature(feature as Feature)
    },
  },
  {
    label: '多边形区域',
    key: 'delete-polygon',
    visible: ({ feature }) => feature?.get('type') === 'polygon',
  },
  {
    label: '清空点',
    divided: true,
    key: 'clear-point',
    action: () => {
      source.forEachFeature((feature) => {
        if (feature.get('type') === 'point') {
          source.removeFeature(feature)
        }
      })
    },
  },
])
</script>

<template>
  <OlMap :ol-map class="w-100% h-400px">
    <Contextmenu :map="olMap" :items="items" />
  </OlMap>
</template>
