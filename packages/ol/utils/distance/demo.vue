<script lang="ts" setup>
import { kmToNauticalMiles, nauticalMilesToKm } from '@summeruse/ol'
import { NFormItem, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'

const km = ref(10)
const nauticalMiles = computed(() => kmToNauticalMiles(km.value).toFixed(2))

const nauticalMiles2 = ref(5.4)
const km2 = computed(() => nauticalMilesToKm(nauticalMiles2.value).toFixed(2))
</script>

<template>
  <NFormItem label="公里转海里">
    <NInputNumber v-model:value="km" :min="0" /> 公里
    <span> = {{ nauticalMiles }} 海里 </span>
  </NFormItem>
  <NFormItem label="海里转公里">
    <NInputNumber v-model:value="nauticalMiles2" :min="0" /> 海里公里
    <span> = {{ km2 }} 海里 </span>
  </NFormItem>
</template>
