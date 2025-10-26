<script setup lang="ts">
import type { UseLayerOptions } from '@/components/layer/props'
import Layer from '@/components/layer/index.vue'
import { ref, watch } from 'vue'

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
      <template v-if="content">
        <component :is="content(close)" v-if="typeof content === 'function'" />
        <template v-else>
          {{ content }}
        </template>
      </template>
      <!-- <RenderVNode
        v-if="content" :dynamic-v-node="() => {
          if (typeof content === 'function') {
            return content(close)
          }
          return content
        }"
      /> -->
    </template>
  </Layer>
</template>
