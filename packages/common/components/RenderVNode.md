# RenderVNode

用于渲染 VNode 的组件。

## 用法

```vue
<script setup lang="ts">
import { RenderVNode } from '@summeruse/cesium'
import { h } from 'vue'
const vNode = h('div', {
  style: {
    color: 'red',
  },
}, 'Hello World')
</script>

<template>
  <RenderVNode :dynamic-v-node="vNode" />
</template>
```
