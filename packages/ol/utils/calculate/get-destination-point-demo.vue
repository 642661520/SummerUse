<script lang="ts" setup>
import { createStyle, createVectorLayer, EPSG_4326, getDestinationPoint, getOSMLayer, OlMap } from '@summeruse/ol'
import { NForm, NFormItem, NInputNumber } from 'naive-ui'
import { Feature, Map as OLMap } from 'ol'
import { Point } from 'ol/geom'
import { computed, ref, watchEffect } from 'vue'

const olMap = new OLMap()
const osmLayer = getOSMLayer()
olMap.addLayer(osmLayer)

const { source, layer } = createVectorLayer({
  style: createStyle({
    circleOptions: {
      radius: 5,
      fillOptions: {
        color: '#f00',
      },
      strokeOptions: {
        color: '#000',
        width: 2,
      },
    },
  }),
})

olMap.addLayer(layer)

const distance = ref(1000)

const bearing = ref(45)

const longitude = ref(120)

const latitude = ref(30)

const point = computed(() => {
  return [longitude.value, latitude.value]
})

const destinationPoint = computed(() => {
  return getDestinationPoint(point.value, distance.value, bearing.value)
})

watchEffect(() => {
  source.clear()
  const startFeature = new Feature({
    geometry: new Point(point.value),
    name: 'start',
  })
  const endFeature = new Feature({
    geometry: new Point(destinationPoint.value),
  })
  source.addFeatures([startFeature, endFeature])
})
</script>

<template>
  <NForm label-placement="left" inline>
    <NFormItem label="经度">
      <NInputNumber v-model:value="longitude" :step="0.1" placeholder="经度" />
    </NFormItem>
    <NFormItem label="纬度">
      <NInputNumber v-model:value="latitude" :step="0.1" placeholder="纬度" />
    </NFormItem>
    <NFormItem label="距离">
      <NInputNumber v-model:value="distance" placeholder="距离" /> 米
    </NFormItem>
    <NFormItem label="方位角">
      <NInputNumber v-model:value="bearing" placeholder="方位" /> 度
    </NFormItem>
  </NForm>
  <NFormItem label="目标点" label-placement="left">
    {{ destinationPoint }}
  </NFormItem>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
