<script setup lang="ts">
import type { CreateLayerOptions } from '@/components/layer/props'
import Layer from '@/components/layer/index.vue'
import { ref, watch } from 'vue'

defineOptions({
  name: 'InjectLayer',
})

const { content, ...props } = defineProps<CreateLayerOptions>()

const emits = defineEmits<{
  afterLeave: []
}>()

const show = ref(true)

function hide() {
  show.value = false
}

function open() {
  show.value = true
}

defineExpose({
  hide,
  open,
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
    </template>
  </Layer>
</template>
