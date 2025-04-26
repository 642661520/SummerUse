<script lang="ts" setup>
import { NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'
import { useLayer } from '.'

const container = ref<HTMLElement>()

const minWidth = ref(100)
const minHeight = ref(100)

const { rect } = useLayer(container, {
  initRect: {
    width: 300,
    height: 100,
    x: 500,
    y: 100,
  },
  minWidth,
  minHeight,
  maxWidth: 500,
  maxHeight: 120,
  ratio: 3 / 1,
})

const style = computed(() => {
  return {
    width: `${rect.value.width}px`,
    height: `${rect.value.height}px`,
    left: `${rect.value.x}px`,
    top: `${rect.value.y}px`,
  }
})
</script>

<template>
  <NInputNumber v-model:value="minWidth" />
  <NInputNumber v-model:value="minHeight" />
  <Teleport to="body">
    <div
      ref="container" class="fixed z-1000 bg-black" :style
    />
  </Teleport>
</template>
