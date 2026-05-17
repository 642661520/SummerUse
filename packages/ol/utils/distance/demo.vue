<script lang="ts" setup>
import { angleToRotation, formatAngle, formatRotation, kmToNauticalMiles, nauticalMilesToKm, rotationToAngle } from '@summeruse/ol'
import { NFormItem, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'

// 公里 ↔ 海里
const km = ref(10)
const nauticalMiles = computed(() => kmToNauticalMiles(km.value).toFixed(2))

const nauticalMiles2 = ref(5.4)
const km2 = computed(() => nauticalMilesToKm(nauticalMiles2.value).toFixed(2))

// 弧度 ↔ 角度
const rotation = ref(Math.PI)
const angle = computed(() => rotationToAngle(rotation.value).toFixed(1))

const angle2 = ref(180)
const rotation2 = computed(() => angleToRotation(angle2.value).toFixed(4))

// 格式化
const rawRotation = ref(-0.5)
const formattedRotation = computed(() => formatRotation(rawRotation.value).toFixed(4))

const rawAngle = ref(400)
const formattedAngle = computed(() => formatAngle(rawAngle.value))
</script>

<template>
  <NFormItem label="公里转海里">
    <NInputNumber v-model:value="km" :min="0" /> 公里
    <span> = {{ nauticalMiles }} 海里 </span>
  </NFormItem>
  <NFormItem label="海里转公里">
    <NInputNumber v-model:value="nauticalMiles2" :min="0" /> 海里
    <span> = {{ km2 }} 公里 </span>
  </NFormItem>
  <NFormItem label="弧度转角度">
    <NInputNumber v-model:value="rotation" :step="0.1" /> 弧度
    <span> = {{ angle }}° </span>
  </NFormItem>
  <NFormItem label="角度转弧度">
    <NInputNumber v-model:value="angle2" /> 度
    <span> = {{ rotation2 }} 弧度 </span>
  </NFormItem>
  <NFormItem label="格式化弧度">
    <NInputNumber v-model:value="rawRotation" :step="0.1" /> 原始弧度
    <span> → {{ formattedRotation }}（[0, 2π)）</span>
  </NFormItem>
  <NFormItem label="格式化角度">
    <NInputNumber v-model:value="rawAngle" /> 原始角度
    <span> → {{ formattedAngle }}°（[0, 360)）</span>
  </NFormItem>
</template>
