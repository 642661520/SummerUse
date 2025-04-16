<script setup lang="ts">
import { NButton, useDialog, useMessage, useModal, useNotification } from 'naive-ui'

const dialog = useDialog()!

const message = useMessage()!

const modal = useModal()!

const notification = useNotification()!

function openDialog() {
  dialog.info({
    title: 'dialog',
  })
}

function openMessage() {
  message.info('Message')
}

function openModal() {
  modal.create({
    title: 'modal',
    preset: 'card',
    content: 'modal content',
    style: {
      width: '300px',
    },
  })
}

function openNotification() {
  notification.info({
    title: 'notification',
  })
}
</script>

<template>
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
</template>
