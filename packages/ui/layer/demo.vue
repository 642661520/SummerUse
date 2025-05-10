<script lang="ts" setup>
import type { Rect } from '@summeruse/common'
import { NButton, NCard } from 'naive-ui'
import { ref } from 'vue'
import Layer from './index.vue'

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
    v-model:show="show" v-model:init-rect="initRect" :teleport="teleport" on-top
    :min-height="300" :ratio="600 / 300"
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
