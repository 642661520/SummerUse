<script lang="ts" setup>
import { EPSG_3857ToEPSG_4326, EPSG_4326ToEPSG_3857 } from '@summeruse/ol'
import { NFormItem, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'

const coord = ref([116.404, 39.915])

const mercator = computed(() => EPSG_4326ToEPSG_3857(coord.value))

const mercator2 = ref([12959638.8957, 4855982.5492])
const coord2 = computed(() => EPSG_3857ToEPSG_4326(mercator2.value))
</script>

<template>
  <NFormItem label="WGS84坐标转墨卡托">
    <NInputNumber v-model:value="coord[0]" :step="0.1" /> 经度
    <NInputNumber v-model:value="coord[1]" :step="0.1" /> 纬度
  </NFormItem>
  <NFormItem label="=">
    <span> {{ mercator[0] }} , {{ mercator[1] }} </span>
  </NFormItem>
  <NFormItem label="墨卡托转WGS84">
    <NInputNumber v-model:value="mercator2[0]" :step="0.1" /> x
    <NInputNumber v-model:value="mercator2[1]" :step="0.1" /> y
  </NFormItem>
  <NFormItem label="=">
    <span> {{ coord2[0] }} , {{ coord2[1] }} </span>
  </NFormItem>
</template>
