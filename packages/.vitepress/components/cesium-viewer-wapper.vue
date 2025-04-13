<script lang="ts" setup>
import { CesiumViewer } from '@summeruse/cesium'

defineOptions({
  name: 'CesiumViewerWrapper',
})
</script>

<template>
  <CesiumViewer class="w-100% h-300px">
    <template #default="{ viewer }">
      <slot :viewer="viewer" />
    </template>
  </CesiumViewer>
</template>
