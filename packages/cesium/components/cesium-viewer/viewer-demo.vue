<script lang="ts" setup>
import ContentDemo from './content-demo.vue'
import CesiumViewer from './index.vue'
</script>

<template>
  <CesiumViewer class="w-100% h-300px">
    <template #default="{ viewer }">
      <ContentDemo :viewer />
    </template>
  </CesiumViewer>
</template>
