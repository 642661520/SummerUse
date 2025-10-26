# injectLayer

::: tip 使用前提
如果你想通过 injectLayer 使用对话框，你需要把调用其方法的组件放在 [layer-provider](../../components/layer-provider/index.md) 内部并且使用 injectLayer 去获取 API。
:::

## 使用示例

<script setup>
import LayerProviderDemo from '../../components/layer-provider/layer-provider-demo.vue'
import InjectLayerDemo from './inject-layer-demo.vue'
</script>

<ClientOnly>
<LayerProviderDemo>
  <InjectLayerDemo />
</LayerProviderDemo>
</ClientOnly>

::: details 点我查看代码
::: code-group
```vue [demo.vue]
<script>
// import InjectLayerDemo from '~/layer-provider-demo.vue'
// import LayerProviderDemo from '~/layer-provider-demo.vue'
</script>

<template>
  <LayerProviderDemo>
    <InjectLayerDemo />
  </LayerProviderDemo>
</template>
```
<<<./inject-layer-demo.vue
<<<../../components/layer-provider/layer-provider-demo.vue
:::
