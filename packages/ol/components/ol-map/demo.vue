<script lang="ts" setup>
import type { OlMapProps } from '@summeruse/ol'
import {
  createOpenStreetMapLayer,
  EPSG_4326ToEPSG_3857,
  OlMap,
} from '@summeruse/ol'
import { NSwitch } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { computed, ref } from 'vue'

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
    altShiftDragRotate: true,
  },
)
const zoom = ref<number>(12)

const rotation = ref<number>(0)

const rotationInDegrees = computed(() => {
  const d = rotation.value * 180 / Math.PI
  return d.toFixed(1)
})
</script>

<template>
  显示缩放按钮
  <NSwitch v-model:value="mapOptions.showZoom" />
  显示比例尺
  <NSwitch v-model:value="mapOptions.showScale" />
  显示全屏按钮
  <NSwitch v-model:value="mapOptions.showFullScreen" />
  当前缩放级别: {{ zoom }}
  当前旋转角度: {{ rotationInDegrees }}
  <OlMap v-bind="mapOptions" v-model:rotation="rotation" v-model:zoom="zoom" class="w-100% h-400px" :ol-map />
</template>
