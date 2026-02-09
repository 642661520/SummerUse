<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { NCesiumPointermoveProps } from './props'
import { Cesium3DTileFeature, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'
import { NPopover } from 'naive-ui'
import { ref, shallowRef, watchEffect } from 'vue'

const props = defineProps<NCesiumPointermoveProps>()

const popoverConfig = ref({
  visible: false,
  x: 0,
  y: 0,
})

const child = shallowRef<(() => VNodeChild) | VNodeChild | string>()

const placement = ref<PopoverPlacement>('bottom-start')

const raw = ref(false)

const showArrow = ref(false)

let handler: ScreenSpaceEventHandler | null = null

watchEffect(() => {
  const viewer = props.viewer
  if (viewer) {
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
      popoverConfig.value.visible = false
      const pick = viewer.scene.pick(movement.endPosition)
      const _3DTileFeature = pick instanceof Cesium3DTileFeature ? pick : undefined
      const entity = (pick && !_3DTileFeature) ? viewer.entities.getById(pick.id.id) : undefined
      const options = props.createOptions({
        movement,
        feature: _3DTileFeature || entity,
      })
      if (options) {
        const offset = viewer.container.getBoundingClientRect()
        const clientX = movement.startPosition.x + offset.left
        const clientY = movement.startPosition.y + offset.top
        child.value = options.content
        placement.value = options.placement || 'bottom-start'
        showArrow.value = options.showArrow || false
        raw.value = options.raw || false
        popoverConfig.value.visible = true
        popoverConfig.value.x = clientX
        popoverConfig.value.y = clientY
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)
  }
})
</script>

<template>
  <NPopover
    style="pointer-events: none;"
    :show-arrow :raw :placement :show="popoverConfig.visible" :x="popoverConfig.x" :y="popoverConfig.y"
    trigger="manual" :theme-overrides="{
      boxShadow: 'none',
    }"
  >
    <template v-if="child">
      <component :is="child()" v-if="typeof child === 'function'" />
      <template v-else>
        {{ child }}
      </template>
    </template>
  </NPopover>
</template>
