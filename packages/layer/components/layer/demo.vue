<script lang="ts" setup>
import type { Rect } from '@summeruse/layer'
import { Layer } from '@summeruse/layer'
import { NButton, NCard } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const props = defineProps<{
  initRect?: Rect
}>()

const show = ref(true)

const initRect = ref(props.initRect ?? {
  x: 500,
  y: 500,
  width: 200,
  height: 200,
})

const ratio = ref(1)

const layerRef = useTemplateRef('layer')

setTimeout(() => {
  ratio.value = 0.7
  layerRef.value?.setRect({
    x: 500,
    y: 500,
    width: 300,
    height: 300,
  })
}, 1000)

const teleport = ref(true)
</script>

<template>
  <NButton @click="show = !show">
    {{ show ? '关闭' : "打开" }}
  </NButton>
  <NButton @click="teleport = !teleport">
    {{ teleport ? '返回' : "弹出" }}
  </NButton>
  <Layer
    ref="layer"
    v-model:show="show" :ratio="ratio" :init-rect="initRect" :teleport="teleport" on-top
  >
    <template #default="{ close }">
      <slot :close :show>
        <NCard header-class="layer-header" title="标题" class="w-100% h-100%">
          <template #header-extra>
            <div class="h-20px flex cursor-pointer hover:bg-#abf5 w-20px items-center justify-center" @click="close">
              <div>x</div>
            </div>
          </template>
        </NCard>
      </slot>
    </template>
  </Layer>
</template>
