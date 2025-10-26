<script setup lang="ts">
import { injectLayer } from '@summeruse/layer'
import { NButton, NCard } from 'naive-ui'
import { h, ref } from 'vue'

const layer = injectLayer()

const initRect = ref({
  width: 200,
  height: 200,
  x: 100,
  y: 100,
})

let index = 0

function create() {
  initRect.value = {
    width: initRect.value.width,
    height: initRect.value.height,
    x: initRect.value.x + 10,
    y: initRect.value.y + 10,
  }
  let t: number
  index++
  const title = `标题${index}`
  const time = ref(5)
  const res = layer.create({
    initRect: initRect.value,
    onTop: true,
    content: () => {
      return h(NCard, {
        title,
        style: {
          width: '100%',
          height: '100%',
        },
        closable: true,
        onClose: () => {
          clearInterval(t)
          res.destroy()
        },
      }, {
        default: () => {
          return `倒计时${time.value}s`
        },
      })
    },
  })
  t = window.setInterval(() => {
    time.value--
    if (time.value <= 0) {
      res.destroy()
      clearInterval(t)
    }
  }, 1000)
}
</script>

<template>
  <NButton @click="create">
    新建窗口
  </NButton>
  <NButton
    @click="() => {
      layer.destroyAll()
    }"
  >
    关闭所有窗口
  </NButton>
</template>
