<script lang="ts" setup>
import {
  createOpenStreetMapLayer,
  createPointFeature,
  createVectorLayer,
  OlMap,
} from '@summeruse/ol'
import { NCard, NPopover } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { h } from 'vue'
import { usePointermove } from '.'

const olMap = new OLMap()
olMap.addLayer(createOpenStreetMapLayer())

const feature = createPointFeature([116.3912, 39.9072], {
  id: 'feature1',
  styleOptions: {
    circleOptions: {
      radius: 10,
      fillOptions: {
        color: 'red',
      },
      strokeOptions: {
        color: 'red',
        width: 10,
      },
    },
  },
  data: {
    name: '天安门',
    src: 'https://q6.itc.cn/images01/20251010/fc56df887f104e34b860f88976b12b74.jpeg',
  },
})

const feature2 = createPointFeature([116.4074, 39.9042], {
  id: 'feature2',
  styleOptions: {
    circleOptions: {
      radius: 10,
      fillOptions: {
        color: 'green',
      },
      strokeOptions: {
        color: 'green',
        width: 10,
      },
    },
  },
})

const { layer, source } = createVectorLayer()
source.addFeature(feature)
source.addFeature(feature2)

olMap.addLayer(layer)

const { visible, position, content, option } = usePointermove<{ raw?: boolean, showArrow?: boolean }>(
  {
    mapRef: olMap,
    items: [{
      raw: true,
      showArrow: false,
      offset: {
        x: 0,
        y: -20,
      },
      content: ({ feature }) => {
        // console.log(feature)
        const { name, src } = feature.get('data') || {}
        return h(NCard, {
          title: name,
          content() {
            return h('img', {
              src,
              style: {
                width: '300px',
                height: '200px',
              },
            })
          },
        })
      },
      priority: 99,
      cursor: 'pointer',
      visible: ({ feature }) => feature.get('id') === 'feature1',
    }, {
      content: ({ feature }) => feature.get('id'),
      cursor: 'progress',
      visible: ({ feature }) => feature.get('id') !== undefined,
      fixedFeatureCenter: false,
    }],
    forceUpdate: true,
  },
)
</script>

<template>
  <OlMap
    class="w-100% h-400px" :center="[116.3912, 39.9072]" :zoom="14" projection="EPSG:4326" :ol-map
  />
  <NPopover
    v-bind="option" :arrow-style="{ pointerEvents: 'none' }" style="pointer-events: none;" trigger="manual"
    :show="visible" :x="position.x" :y="position.y"
  >
    <template v-if="typeof content === 'function'">
      <component :is="content" />
    </template>
    <template v-else>
      {{ content }}
    </template>
  </NPopover>
</template>
