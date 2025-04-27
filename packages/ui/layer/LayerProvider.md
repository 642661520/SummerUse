# LayerProvider
## 组件介绍

用于管理Layer zIndex的组件。

当Layer设置了 onTop, 最后打开或点击的Layer会被置顶。

当你需要在多个Layer之间切换时，建议使用此组件。

## 使用示例

<script setup>
import LayerProviderDemo from './layer-provider-demo.vue'
</script>
<ClientOnly>
<LayerProviderDemo />
</ClientOnly>
