<script setup lang="ts">
import { LayerProvider } from '@summeruse/ui'
import { NCard } from 'naive-ui'
import Demo from './demo.vue'
</script>

<template>
  <LayerProvider>
    <div class="flex flex-col gap-5">
      <div>
        窗口1
        <Demo
          :init-rect="{
            width: 200,
            height: 200,
            x: 100,
            y: 100,
          }"
        >
          <NCard title="窗口1" class="w-100% h-100% bg-blueGray" />
        </Demo>
      </div>
      <div>
        窗口2
        <Demo
          :init-rect="{
            width: 300,
            height: 300,
            x: 300,
            y: 300,
          }"
        >
          <NCard title="窗口2" class="w-100% h-100% bg-blue" />
        </Demo>
      </div>
    </div>
  </LayerProvider>
</template>
