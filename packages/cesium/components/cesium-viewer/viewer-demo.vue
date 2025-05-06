<script lang="ts" setup>
import { CesiumViewer } from '@summeruse/cesium'
import ContentDemo from './content-demo.vue'
</script>

<template>
  <CesiumViewer class="w-100% h-300px">
    <template #default="{ viewer }">
      <ContentDemo :viewer />
    </template>
  </CesiumViewer>
</template>
