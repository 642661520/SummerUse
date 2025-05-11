<script lang="ts" setup>
import type { Rect } from '@summeruse/common'
import type { StyleValue } from 'vue'
import type { LayerProps } from './props'
import { useLayer } from '@summeruse/common'
import { computed, ref, toRefs, useTemplateRef, watch } from 'vue'
import { useLayerIndexManager } from './layer-provider'

const props = withDefaults(defineProps<LayerProps>(), {
  to: 'body',
})

const propsRef = toRefs(props)

const show = defineModel<boolean>('show', {
  required: true,
})

const layerIndexManager = useLayerIndexManager()

const zIndex = ref(propsRef.onTop.value ? layerIndexManager.nextZIndex() : layerIndexManager.defaultZIndex)

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

  return propsRef.disabledResize.value
})

const layerRef = useTemplateRef('layer')

const rectModel = defineModel<Rect>('initRect', {
  required: true,
})

const { rect, check } = useLayer(layerRef, {
  ...propsRef,
  disabledDrag,
  disabledResize,
  initRect: computed(() => rectModel.value),
})

watch(propsRef.teleport, (teleport) => {
  if (teleport && show.value) {
    check()
  }
})

const style = computed<StyleValue>(() => {
  if (propsRef.teleport.value) {
    return {
      position: 'fixed',
      zIndex: zIndex.value,
      width: `${rect.value.width}px`,
      height: `${rect.value.height}px`,
      left: `${rect.value.x}px`,
      top: `${rect.value.y}px`,
    }
  }
  return undefined
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
    <div v-if="show" v-bind="$attrs" ref="layer" :style @mousedown="handleTop">
      <slot :close />
    </div>
  </Teleport>
</template>
