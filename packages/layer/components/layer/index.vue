<script lang="ts" setup>
import type { StyleValue } from 'vue'
import type { LayerProps } from './props'
import { useLayerIndexManager } from '@/components/layer-provider'
import { useLayer } from '@/composables/useLayer'
import { useResizeObserver } from '@vueuse/core'
import { computed, ref, toRefs, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<LayerProps>(), {
  to: 'body',
  destroyOnClose: true,
})

const propsRef = toRefs(props)

const show = defineModel<boolean>('show', {
  required: true,
})

const layerRef = useTemplateRef('layer')

const contentRef = useTemplateRef('content')

const rectModel = defineModel<{
  x?: number
  y?: number
  width?: number
  height?: number
}>('initRect', {
  required: true,
})

const initRect = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  ...rectModel.value,
})

const layerIndexManager = useLayerIndexManager()

const zIndex = ref(propsRef.onTop.value ? layerIndexManager.nextZIndex() : layerIndexManager.defaultZIndex)

const hidden = computed(() => {
  if (!propsRef.teleport.value) {
    return false
  }
  return !show.value
})

const destroyed = computed(() => {
  if (!propsRef.teleport.value) {
    return false
  }
  return propsRef.destroyOnClose.value && !show.value
})

const disabledDrag = computed(() => {
  if (!propsRef.teleport.value) {
    return true
  }

  return propsRef.disabledDrag.value
})

const disabledResize = computed(() => {
  if (!propsRef.teleport.value) {
    return true
  }
  if (!rectModel.value.width || !rectModel.value.height) {
    return true
  }
  return propsRef.disabledResize.value
})

const { rect, check } = useLayer(layerRef, {
  ...propsRef,
  disabledDrag,
  disabledResize,
  initRect,
})

useResizeObserver(contentRef, (entries) => {
  const entry = entries[0]
  if (disabledResize.value && entry) {
    const { width, height } = entry.target.getBoundingClientRect()
    rect.value.width = width
    rect.value.height = height
    check()
  }
})

watch(propsRef.teleport, (teleport) => {
  if (teleport && show.value) {
    check()
  }
})

watch(() => rectModel.value.height, (value) => {
  if (value) {
    rect.value.height = value
    check()
  }
})
watch(() => rectModel.value.width, (value) => {
  if (value) {
    rect.value.width = value
    check()
  }
})
watch(() => rectModel.value.x, (value) => {
  if (value) {
    rect.value.x = value
    check()
  }
})
watch(() => rectModel.value.y, (value) => {
  if (value) {
    rect.value.y = value
    check()
  }
})

const style = computed<StyleValue>(() => {
  const style: StyleValue = !hidden.value
    ? [{
        display: 'block',
      }]
    : [{
        display: 'none',
      }]

  if (propsRef.teleport.value) {
    style.push({
      position: 'fixed',
      zIndex: zIndex.value,
      left: `${rect.value.x}px`,
      top: `${rect.value.y}px`,
    })
    if (!propsRef.disabledResize.value) {
      style.push({
        width: `${rect.value.width}px`,
        height: `${rect.value.height}px`,
      })
    }
  }
  return style
})

function close() {
  show.value = false
}

function handleTop() {
  if (!propsRef.teleport.value) {
    return
  }

  if (!propsRef.onTop.value) {
    return
  }
  zIndex.value = layerIndexManager.nextZIndex()
}
</script>

<template>
  <Teleport :to="to" :disabled="!teleport">
    <div v-if="!destroyed" v-bind="$attrs" ref="layer" :style @mousedown="handleTop">
      <div ref="content" style="width: 100%; height: 100%;">
        <slot :close />
      </div>
    </div>
  </Teleport>
</template>
