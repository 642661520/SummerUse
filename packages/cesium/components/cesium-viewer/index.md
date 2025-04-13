---
title: 地图组件
---

# cesium-viewer

## 组件介绍

`cesium-viewer` 组件是一个基于 Cesium 的地图容器组件。

viewer 实例有以下方式获取:

1.通过组件实例获取

2.后代组件通过 useCeiusmViewer 获取

3.子组件通过 props 获取

## 使用示例

<script setup>
import ViewerDemo from './viewer-demo.vue'
</script>
<ClientOnly>
<ViewerDemo />
</ClientOnly>

::: details 点我查看代码
::: code-group
<<<./viewer-demo.vue
<<<./content-demo.vue
:::

## 组件代码

::: details 点我查看代码
<<<./index.vue
:::

## 类型定义

::: details 点我查看代码
<<<./props.ts
:::
