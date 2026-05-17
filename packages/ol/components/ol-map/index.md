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

4.后代组件通过 useOlMap 获取

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

## API

### OlMapProps {#OlMapProps}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| olMap | `OLMap` | - | 外部创建的 OL Map 实例，非响应式，view 会被内部替换 |
| center | `Coordinate` | - | 地图中心点，需对应 `projection` |
| rotation | `number` | `0` | 旋转角度（弧度），支持 `v-model:rotation` |
| zoom | `number` | - | 缩放级别，支持 `v-model:zoom` |
| minZoom | `number` | - | 最小缩放级别 |
| maxZoom | `number` | - | 最大缩放级别 |
| constrainResolution | `boolean` | `true` | 是否整数缩放级别 |
| projection | `ProjectionLike` | `EPSG:3857` | 地图投影 |
| extent | `Extent` | - | 地图范围，非响应式 |
| showZoom | `boolean` | `false` | 显示缩放控件 |
| showAttribution | `boolean` | `false` | 显示版权控件 |
| showRotate | `boolean` | `false` | 显示旋转控件 |
| showFullScreen | `boolean` | `false` | 显示全屏按钮 |
| showOverview | `boolean` | `false` | 显示鹰眼控件 |
| showScale | `boolean` | `false` | 显示比例尺控件 |
| dragPan | `boolean` | `true` | 启用拖拽平移 |
| mouseWheelZoom | `boolean` | `true` | 启用滚轮缩放 |
| doubleClickZoom | `boolean` | `false` | 启用双击缩放 |
| pinchRotate | `boolean` | `true` | 启用双指旋转 |
| pinchZoom | `boolean` | `true` | 启用双指缩放 |
| altShiftDragRotate | `boolean` | `false` | 启用 Alt+Shift+拖拽旋转 |

### OlMapEmits {#OlMapEmits}

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:zoom` | `[number]` | zoom 双向绑定 |
| `update:center` | `[Coordinate]` | center 双向绑定 |
| `update:rotation` | `[number]` | rotation 双向绑定 |
| `changeResolution` | `[ObjectEvent]` | 分辨率变化 |
| `changeRotation` | `[ObjectEvent]` | 旋转角度变化 |
| `changeCenter` | `[ObjectEvent]` | 中心点变化 |
| `moveend` | `[MapEvent]` | 地图移动结束 |
| `movestart` | `[MapEvent]` | 地图开始移动 |

### 依赖注入

| 名称 | 类型 | 说明 |
|------|------|------|
| useOlMap | `() => OLMap \| undefined` | 从后代组件获取地图实例（需在 OlMap 子组件内调用） |
| olMapInjectionKey | `InjectionKey<OLMap>` | provide/inject 的 key |

### 实例类型

| 名称 | 类型 | 说明 |
|------|------|------|
| OlMapInst | `InstanceType<typeof OlMap>` | 组件实例类型，用于 `ref<OlMapInst>` |

## 组件代码

::: details 点我查看代码
<<<./index.vue
:::

## 类型定义

::: details 点我查看代码
<<<./props.ts
:::
