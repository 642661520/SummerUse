<template>
  显示缩放按钮
  <NSwitch v-model:value="mapOptions.showZoom" />
  显示比例尺
  <NSwitch v-model:value="mapOptions.showScale" />
  显示全屏按钮
  <NSwitch v-model:value="mapOptions.showFullScreen" />
  <OlMap class="w-100% h-400px" v-bind="mapOptions" :olMap></OlMap>
</template>
<script lang="ts" setup>
  import { getOSMLayer, wgs84ToMercator } from '@summeruse/ol';
  import OlMap from './index.vue';
  import type { OlMapProps } from './props';
  import { ref } from 'vue';
  import { NSwitch } from 'naive-ui';
  import { Map as OLMap } from 'ol';
  const olMap = new OLMap()
  olMap.addLayer(getOSMLayer());
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
    }
  );
</script>