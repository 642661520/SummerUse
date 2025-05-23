<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { NOlPointermoveProps } from './props'
import { RenderVNode } from '@summeruse/common'
import { NPopover } from 'naive-ui'
import { getCenter } from 'ol/extent'
import { onMounted, ref, shallowRef } from 'vue'

const props = defineProps<NOlPointermoveProps>()

const popoverConfig = ref({
  visible: false,
  x: 0,
  y: 0,
})

const child = shallowRef<(() => VNodeChild) | VNodeChild | string>()

const placement = ref<PopoverPlacement>('bottom-start')

const raw = ref(false)

const showArrow = ref(false)

onMounted(() => {
  props.olMap?.on('pointermove', (event) => {
    const features = props.olMap.getFeaturesAtPixel(event.pixel)
    popoverConfig.value.visible = false
    const options = props.createOptions({
      pixel: event.pixel,
      coordinate: event.coordinate,
      features,
    })
    if (options) {
      child.value = options.content
      placement.value = options.placement || 'bottom-start'
      showArrow.value = options.showArrow || false
      raw.value = options.raw || false
      popoverConfig.value.visible = true
      if ((options.followTarget === 'feature') && (features.length > 0)) {
        const feature = features[0]
        const geometry = feature.getGeometry()
        if (geometry) {
          const extent = geometry.getExtent()
          const center = getCenter(extent)
          const pixel = props.olMap.getPixelFromCoordinate(center)
          const { top, left } = props.olMap.getViewport().getBoundingClientRect()
          popoverConfig.value.x = pixel[0] + left
          popoverConfig.value.y = pixel[1] + top
          return
        }
      }
      // console.log(event)
      const { clientX, clientY } = event.originalEvent as PointerEvent
      popoverConfig.value.x = clientX
      popoverConfig.value.y = clientY
    }
  })
})
</script>

<template>
  <NPopover
    :show-arrow :raw :placement :show="popoverConfig.visible" :x="popoverConfig.x" :y="popoverConfig.y"
    trigger="manual" class="n-ol-pointermove" :theme-overrides="{
      boxShadow: 'none',
    }"
  >
    <RenderVNode :dynamic-v-node="child" />
  </NPopover>
</template>
