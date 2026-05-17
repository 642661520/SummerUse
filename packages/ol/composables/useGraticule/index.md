# useGraticule

## 简介

在地图上显示经纬度网格（Graticule）。通过 `showGraticule` 响应式地控制网格的显隐。

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
| useGraticule | `(options: UseGraticuleOptions) => UseGraticuleReturn` |

### UseGraticuleOptions {#UseGraticuleOptions}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| olMap | `MaybeRef<OLMap \| null \| undefined>` | - | 地图实例 |
| graticuleOptions | [`GraticuleOptions`](#GraticuleOptions) | - | 经纬网样式配置 |
| defaultShow | `boolean` | `false` | 初始是否显示 |

### GraticuleOptions {#GraticuleOptions}

继承 OpenLayers `Graticule` 构造参数，额外扩展以下样式字段：

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| strokeStyleOption | [`StrokeOptions`](../../utils/style/index.md#StrokeOptions) | - | 网格线描边样式 |
| labelStyleOption | [`TextOptions`](../../utils/style/index.md#TextOptions) | - | 经纬度标签文本样式（同时作用于经度和纬度） |
| latLabelStyleOption | [`TextOptions`](../../utils/style/index.md#TextOptions) | - | 纬度标签样式（优先级高于 `labelStyleOption`） |
| lonLabelStyleOption | [`TextOptions`](../../utils/style/index.md#TextOptions) | - | 经度标签样式（优先级高于 `labelStyleOption`） |

### UseGraticuleReturn {#UseGraticuleReturn}

| 名称 | 类型 | 说明 |
|------|------|------|
| showGraticule | `Ref<boolean>` | 控制经纬网显隐，修改此值即时生效 |

## 使用说明

- 切换 `showGraticule.value` 即可控制经纬网显示或隐藏。
- `olMap` 支持响应式切换，地图实例变化时经纬网会自动重新绑定。

## 源代码

::: details 点我查看代码
<<< ./index.ts
:::
