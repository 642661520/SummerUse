# 图层

<script setup>
import  CreateVectorLayerDemo from  './create-vector-layer-demo.vue'
import TLayerDemo from './t-layer-demo.vue';
import BingLayerDemo from './bing-layer-demo.vue';
import OSMLayerDemo from './osm-layer-demo.vue';
</script>

## 创建矢量图层

`createVectorLayer`

<ClientOnly>
<CreateVectorLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./create-vector-layer-demo.vue
:::

## 添加 OpenStreetMap 地图

`getOSMLayer`
<ClientOnly>
<OSMLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./osm-layer-demo.vue
:::

## 添加天地图

`getTianDiTuLayer`

<ClientOnly>
<TLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./t-layer-demo.vue
:::

## 添加 Bing 地图

`getBingLayer`

<ClientOnly>
<BingLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./bing-layer-demo.vue
:::
