<script lang="ts" setup>
import { createCanvasLayer, EPSG_4326, OlMap } from '@summeruse/ol'
import { Map as OLMap } from 'ol'

const olMap = new OLMap()

// 使用 Canvas 图层绘制一个简单的标注覆盖层
createCanvasLayer(olMap, (frameState) => {
  const canvas = new OffscreenCanvas(300, 100)
  const ctx = canvas.getContext('2d')!

  // 背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.beginPath()
  ctx.roundRect(0, 0, 280, 70, 8)
  ctx.fill()

  // 文字
  ctx.fillStyle = '#ffffff'
  ctx.font = '16px sans-serif'
  ctx.fillText('Canvas 图层示例', 16, 30)
  ctx.fillStyle = '#aabbcc'
  ctx.font = '12px sans-serif'
  ctx.fillText('通过 refresh 回调逐帧绘制', 16, 52)

  return {
    imageBitmap: canvas.transferToImageBitmap(),
    dpi: window.devicePixelRatio,
  }
})
</script>

<template>
  <OlMap :ol-map :projection="EPSG_4326" :center="[120, 30]" :zoom="10" class="w-100% h-400px" />
</template>
