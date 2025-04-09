---
title: 地图组件
---

# ol-map

## 组件介绍

`ol-map` 组件是一个基于 OpenLayers 的地图容器组件。

ol 实例有以下方式获取:

1.外部直接创建传入组件中

2.通过组件实例获取

3.子组件通过 props 获取

4.后代组件通过 inject 获取

## 使用示例

<script setup>
import Demo from './demo.vue'
</script>
<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

## 组件代码

::: details 点我查看代码
<<<./index.vue
:::

## 类型定义

::: details 点我查看代码
<<<./props.ts
:::
