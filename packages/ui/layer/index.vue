<script lang="ts" setup>
import type { Rect } from '@summeruse/common'
import type { StyleValue } from 'vue'
import type { LayerProps } from './props'
import { useLayer } from '@summeruse/common'
import { computed, ref, toRefs, useTemplateRef } from 'vue'
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
    return false
  }

  return propsRef.disabledDrag.value
})

const disabledResize = computed(() => {
  if (!propsRef.teleport.value) {
    return false
  }

  return propsRef.disabledResize.value
})

const layer = useTemplateRef('layer')

const rectModel = defineModel<Rect>('initRect', {
  required: true,
})

const { rect } = useLayer(layer, {
  ...propsRef,
  disabledDrag,
  disabledResize,
  initRect: computed(() => rectModel.value),
})

const style = computed<StyleValue>(() => {
  if (!propsRef.teleport.value) {
    return {

    }
  }

  return {
    position: 'fixed',
    zIndex: zIndex.value,
    width: `${rect.value.width}px`,
    height: `${rect.value.height}px`,
    left: `${rect.value.x}px`,
    top: `${rect.value.y}px`,
  }
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
    <div v-if="show" ref="layer" :style @mousedown="handleTop">
      <slot :close />
    </div>
  </Teleport>
</template>
