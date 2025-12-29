<script lang="ts" setup>
import type { OlMapProps } from '@summeruse/ol'
import {
  createOpenStreetMapLayer,
  EPSG_4326ToEPSG_3857,
} from '@summeruse/ol'
import { NSwitch } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { ref } from 'vue'
import OlMap from './index.vue'

const olMap = new OLMap()
olMap.addLayer(createOpenStreetMapLayer())
const mapOptions = ref<OlMapProps>(
  {
    center: EPSG_4326ToEPSG_3857([116.404, 39.915]),
    maxZoom: 18,
    minZoom: 3,
    showZoom: true,
    showScale: true,
    showRotate: true,
    showFullScreen: true,
    doubleClickZoom: false,
  },
)
const zoom = ref<number>(12)
</script>

<template>
  显示缩放按钮
  <NSwitch v-model:value="mapOptions.showZoom" />
  显示比例尺
  <NSwitch v-model:value="mapOptions.showScale" />
  显示全屏按钮
  <NSwitch v-model:value="mapOptions.showFullScreen" />
  当前缩放级别: {{ zoom }}
  <OlMap v-bind="mapOptions" v-model:zoom="zoom" class="w-100% h-400px" :ol-map />
</template>
