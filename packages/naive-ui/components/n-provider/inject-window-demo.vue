<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useModal, useNotification } from 'naive-ui'
import InjectContentDemo from './inject-content-demo.vue'

window.$message = useMessage()
window.$dialog = useDialog()
window.$notification = useNotification()
window.$loadingBar = useLoadingBar()
window.$modal = useModal()
</script>

<template>
  <InjectContentDemo />
</template>
