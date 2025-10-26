---
title: NProvider
---

# NProvider

## 组件介绍

统一注册 `naive-ui` 组件，提供全局配置和主题切换、国际化等功能，同时将message、dialog、modal、loading 等组件注入

```vue
<script setup lang="ts">
import { NProvider } from '@summeruse/ui'
</script>

<template>
  <NProvider>
    <App />
  </NProvider>
</template>
```

::: tip 依赖
[`navie-ui`](https://www.naiveui.com/)
:::

## 使用示例

<script setup>
import Demo from './demo.vue'
</script>
<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
::: code-group
<<< @/.vitepress/theme/components/NProviderWrapper.vue
<<< ./demo.vue
:::

## 组件代码

::: details 点我查看代码
<<<./index.vue
:::

<!-- ## Props

::: details 点我查看代码
<<<./props.ts
::: -->
