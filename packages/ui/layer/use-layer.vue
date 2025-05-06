<script setup lang="ts">
import type { UseLayerOptions } from './props'

import { RenderVNode } from '@summeruse/common'
import { ref, watch } from 'vue'
import Layer from './index.vue'

const { content, ...props } = defineProps<UseLayerOptions>()

const emits = defineEmits<{
  afterLeave: []
}>()

const show = ref(true)

function hide() {
  show.value = false
}

defineExpose({
  hide,
})

watch(
  show,
  (val) => {
    if (!val) {
      emits('afterLeave')
    }
  },
)
</script>

<template>
  <Layer v-model:show="show" v-bind="props" teleport>
    <template #default="{ close }">
      <RenderVNode
        v-if="content" :dynamic-v-node="() => {
          if (typeof content === 'function') {
            return content(close)
          }
          return content
        }"
      />
    </template>
  </Layer>
</template>
