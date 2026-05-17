# useSwitchBaseLayer

## 简介

在多套底图之间切换。所有底图图层预先添加到地图中，通过 `visibleLayerName` 控制当前可见的底图，其余自动隐藏。

## 使用示例

<script setup>
import Demo from './demo.vue'
</script>

<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<< ./demo.vue
:::

## API

| 名称 | 类型 |
|--------|--------|
| useSwitchBaseLayer | `(data: UseSwitchBaseLayerOptions) => UseSwitchBaseLayerReturn` |

### UseSwitchBaseLayerOptions {#UseSwitchBaseLayerOptions}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| olMap | `OLMap` | - | 地图实例 |
| layers | `Record<string, TileLayer[]>` | - | 底图字典，key 为底图名称，value 为该底图包含的 TileLayer 数组 |
| defaultLayerName | `string` | 第一个 key | 初始显示的底图名称 |

### UseSwitchBaseLayerReturn {#UseSwitchBaseLayerReturn}

| 名称 | 类型 | 说明 |
|------|------|------|
| visibleLayerName | `Ref<string>` | 当前可见底图的名称，修改此值即可切换底图 |

## 使用说明

- `layers` 中的每个底图可以包含多个 TileLayer，如天地图卫星图需要同时加载影像层和注记层。
- 所有底图图层会在初始化时一次性添加到地图，通过 `setVisible` 控制显隐，不会重复添加。
- 直接将 `visibleLayerName` 绑定到下拉选择器即可实现底图切换 UI。

## 源代码

::: details 点我查看代码
<<< ./index.ts
:::
