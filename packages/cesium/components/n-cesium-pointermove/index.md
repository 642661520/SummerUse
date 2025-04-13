---
title: 移入显示
---

# n-cesium-pointermove

## 组件介绍

::: tip 依赖
[`navie-ui`](https://www.naiveui.com/)
:::

## 使用示例

<script setup>
import Demo from './demo.vue'
</script>
<ClientOnly>
<CesiumViewerWapper>
<template #default="{ viewer }">
<Demo :viewer="viewer" />
</template>
</CesiumViewerWapper>
</ClientOnly>

::: details 点我查看代码
::: code-group
<<< @/.vitepress/components/cesium-viewer-wapper.vue
<<< ./demo.vue
:::

## 组件代码

::: details 点我查看代码
<<<./index.vue
:::

## Props

::: details 点我查看代码
<<<./props.ts
:::
