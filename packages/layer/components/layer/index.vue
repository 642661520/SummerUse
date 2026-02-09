<script lang="ts" setup>
import type { StyleValue } from 'vue'
import type { LayerProps } from './props'
import type { Rect } from '@/composables/useLayer/types'
import { useResizeObserver } from '@vueuse/core'
import { computed, nextTick, ref, toRefs, toValue, useTemplateRef, watch } from 'vue'
import { useLayerIndexManager } from '@/components/layer-provider'
import { useLayer } from '@/composables/useLayer'

defineOptions({
  name: 'Layer',
})

const props = withDefaults(defineProps<LayerProps>(), {
  to: 'body',
  destroyOnClose: true,
})

const emits = defineEmits<{
  dragStart: [Rect]
  dragEnd: [Rect]
  resizeStart: [Rect]
  resizeEnd: [Rect]
}>()

const propsRef = toRefs(props)

const show = defineModel<boolean>('show', {
  required: true,
})

const layerRef = useTemplateRef('layer')

const contentRef = useTemplateRef('content')

const initRect = ref({
  x: props.initRect?.x ?? 0,
  y: props.initRect?.y ?? 0,
  width: props.initRect?.width ?? 0,
  height: props.initRect?.height ?? 0,
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
  if (!props.initRect?.width || !props.initRect?.height) {
    return true
  }
  return propsRef.disabledResize.value
})

const { rect, check, isDrag, isResize } = useLayer(layerRef, {
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

watch(isDrag, (v) => {
  if (v) {
    emits('dragStart', rect.value)
  }
  else {
    emits('dragEnd', rect.value)
  }
})

watch(isResize, (v) => {
  if (v) {
    emits('resizeStart', rect.value)
  }
  else {
    emits('resizeEnd', rect.value)
  }
})

defineExpose({
  getRect: () => toValue(rect),
  setRect: (value: Rect) => {
    nextTick(() => {
      rect.value = value
      check()
    })
  },
})
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
