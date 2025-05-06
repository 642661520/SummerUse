# useLayer

::: tip 使用前提
如果你想通过 useLayer 使用对话框，你需要把调用其方法的组件放在 [layer-provider](./LayerProvider.md) 内部并且使用 useLayer 去获取 API。
:::

## 使用示例

<script setup>
import LayerProviderDemo from './layer-provider-demo.vue'
import UseLayerDemo from './use-layer-demo.vue'
</script>
<ClientOnly>
<LayerProviderDemo>
<UseLayerDemo />
</LayerProviderDemo>
</ClientOnly>

::: details 点我查看代码
::: code-group
```vue [demo.vue]
<script setup>
import LayerProviderDemo from './layer-provider-demo.vue'
import UseLayerDemo from './use-layer-demo.vue'
</script>

<template>
  <LayerProviderDemo>
    <UseLayerDemo />
  </LayerProviderDemo>
</template>
```
<<<./use-layer-demo.vue
<<< ./layer-provider-demo.vue
:::
