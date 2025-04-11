<script setup lang="ts">
  import { NPopover } from 'naive-ui';
  import { onMounted, ref, shallowRef, type VNodeChild } from 'vue';
  import type { NOlPointermoveProps } from './props';
  import type { PopoverPlacement } from 'naive-ui';
  import RenderVNode from '../../../common/components/render-v-node.vue';
  const props = defineProps<NOlPointermoveProps>();

  const popoverConfig = ref({
    visible: false,
    x: 0,
    y: 0,
  });

  const child = shallowRef<(() => VNodeChild) | VNodeChild | string>();

  const placement = ref<PopoverPlacement>('bottom-start');

  const raw = ref(false);

  const showArrow = ref(false);

  onMounted(() => {
    props.olMap?.on('pointermove', (event) => {
      const features = props.olMap.getFeaturesAtPixel(event.pixel);
      const { clientX, clientY } = event.originalEvent as PointerEvent
      popoverConfig.value.visible = false;
      const options = props.createOptions({
        pixel: event.pixel,
        coordinate: event.coordinate,
        features,
      });
      if (options) {
        child.value = options.content
        placement.value = options.placement || 'bottom-start';
        showArrow.value = options.showArrow || false;
        raw.value = options.raw || false;
        popoverConfig.value.visible = true;
        popoverConfig.value.x = clientX;
        popoverConfig.value.y = clientY;
      }
    })
  })

</script>

<template>
  <NPopover :show-arrow :raw :placement :show="popoverConfig.visible" :x="popoverConfig.x" :y="popoverConfig.y"
    trigger="manual" class="n-ol-pointermove" :theme-overrides="{
      boxShadow: 'none'
    }">
    <RenderVNode :dynamic-v-node="child" />
  </NPopover>
</template>