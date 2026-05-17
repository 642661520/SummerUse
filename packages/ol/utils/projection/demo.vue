<script lang="ts" setup>
import { EPSG_3857ToEPSG_4326, EPSG_4326ExtentToEPSG_3857, EPSG_4326ToEPSG_3857, EPSG_3857ExtentToEPSG_4326, createTileGrid, registerEPSG_3395 } from '@summeruse/ol'
import { NButton, NFormItem, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'

// 坐标转换
const coord = ref([116.404, 39.915])
const mercator = computed(() => EPSG_4326ToEPSG_3857(coord.value))

const mercator2 = ref([12959638.8957, 4855982.5492])
const coord2 = computed(() => EPSG_3857ToEPSG_4326(mercator2.value))

// 范围转换
const bbox = computed(() => {
  const [lon, lat] = coord.value
  const d = 0.5
  return [lon - d, lat - d, lon + d, lat + d] as [number, number, number, number]
})
const mercatorBbox = computed(() => EPSG_4326ExtentToEPSG_3857(bbox.value))
const backBbox = computed(() => EPSG_3857ExtentToEPSG_4326(mercatorBbox.value))

// 注册 EPSG:3395
const registered = ref(false)
function doRegister() {
  registerEPSG_3395()
  registered.value = true
}

// 创建 TileGrid
const tileGridInfo = computed(() => {
  const grid = createTileGrid('EPSG:3395')
  if (!grid) return '未注册 EPSG:3395，请先点击注册'
  return `TileSize: ${grid.getTileSize(0)}, Extent: [${grid.getExtent().join(', ')}]`
})
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
  <NFormItem label="范围转换">
    <span>4326 bbox: [{{ bbox.join(', ') }}]</span>
  </NFormItem>
  <NFormItem label="→ 3857">
    <span>[{{ mercatorBbox.map(v => v.toFixed(0)).join(', ') }}]</span>
  </NFormItem>
  <NFormItem label="→ 4326 回转换">
    <span>[{{ backBbox.map(v => v.toFixed(4)).join(', ') }}]</span>
  </NFormItem>
  <NFormItem label="EPSG:3395">
    <NButton :disabled="registered" @click="doRegister">
      {{ registered ? '已注册' : '注册 EPSG:3395' }}
    </NButton>
  </NFormItem>
  <NFormItem label="TileGrid">
    <span>{{ tileGridInfo }}</span>
  </NFormItem>
</template>
