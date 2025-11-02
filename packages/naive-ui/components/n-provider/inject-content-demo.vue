<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'

function openDialog() {
  window.$dialog.info({
    title: 'dialog',
    content: 'dialog content',
  })
}
function openMessage() {
  window.$message.info('message content')
}
function openModal() {
  window.$modal.create({
    title: 'modal',
    preset: 'card',
    content: 'modal content',
  })
}
function openNotification() {
  window.$notification.info({
    content: 'notification content',
  })
}
function openLoadingBar() {
  window.$loadingBar.start()
  setTimeout(() => {
    window.$loadingBar.finish()
  }, 1000)
}
</script>

<template>
  <NSpace>
    <NButton @click="openDialog">
      dialog
    </NButton>
    <NButton @click="openMessage">
      message
    </NButton>
    <NButton @click="openModal">
      modal
    </NButton>
    <NButton @click="openNotification">
      notification
    </NButton>
    <NButton @click="openLoadingBar">
      loadingBar
    </NButton>
  </NSpace>
</template>
