<script lang="ts" setup>
import type { OlMapProps } from '@summeruse/ol'
import {
  getOSMLayer,
  OlMap,
  wgs84ToMercator,
  // OlMapInst
} from '@summeruse/ol'
import { NSwitch } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { ref } from 'vue'

const olMap = new OLMap()
olMap.addLayer(getOSMLayer())
const mapOptions = ref<OlMapProps>(
  {
    center: wgs84ToMercator([116.404, 39.915]),
    zoom: 10,
    maxZoom: 18,
    minZoom: 3,
    showZoom: true,
    showScale: true,
    showRotate: true,
    showFullScreen: true,
    doubleClickZoom: false,
  },
)

// const olMapRef = ref<OlMapInst>();
// olMapRef.value?.olMap;
</script>

<template>
  显示缩放按钮
  <NSwitch v-model:value="mapOptions.showZoom" />
  显示比例尺
  <NSwitch v-model:value="mapOptions.showScale" />
  显示全屏按钮
  <NSwitch v-model:value="mapOptions.showFullScreen" />
  <OlMap class="w-100% h-400px" v-bind="mapOptions" :ol-map />
</template>
