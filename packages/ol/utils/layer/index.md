# 图层

<script setup>
import  CreateVectorLayerDemo from  './create-vector-layer-demo.vue'
import TLayerDemo from './t-layer-demo.vue';
import BingLayerDemo from './bing-layer-demo.vue';
import XYZLayerDemo from './xyz-layer-demo.vue';
import PMTilesLayerDemo from './pmtiles-layer-demo.vue';
import WebGLLayerDemo from './webgl-layer-demo.vue';
import CanvasLayerDemo from './canvas-layer-demo.vue';
import HeatmapLayerDemo from './heatmap-layer-demo.vue';
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

`createOpenStreetMapLayer`
<ClientOnly>
<OSMLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./osm-layer-demo.vue
:::

## 添加天地图

`createTianDiTuLayer`

<ClientOnly>
<TLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./t-layer-demo.vue
:::

## 添加 Bing 地图

`createBingLayer`

<ClientOnly>
<BingLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./bing-layer-demo.vue
:::

## 添加 XYZ 图层

`createXYZLayer` — 通用 XYZ 瓦片图层，适用于任何标准 XYZ 瓦片服务。

<ClientOnly>
<XYZLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./xyz-layer-demo.vue
:::

## 添加 PMTiles 图层

`createPMTilesLayer` — 加载 PMTiles 格式的矢量瓦片。

<ClientOnly>
<PMTilesLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./pmtiles-layer-demo.vue
:::

## 添加 WebGL 矢量图层

`createWebGLVectorLayer` — 使用 GPU 渲染的大数据量矢量图层，样式通过 FlatStyle 表达式定义。

<ClientOnly>
<WebGLLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./webgl-layer-demo.vue
:::

## 添加 Canvas 图层

`createCanvasLayer` — 通过 `refresh` 回调在 Canvas 上逐帧绘制，适合自定义渲染、动画覆盖层等场景。

<ClientOnly>
<CanvasLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./canvas-layer-demo.vue
:::

## 添加热力图

`createHeatmapLayer` — 热力图图层，数据点为 Feature，通过 `weight` 字段控制权重。

<ClientOnly>
<HeatmapLayerDemo />
</ClientOnly>

::: details 点我查看代码
<<<./heatmap-layer-demo.vue
:::

## API

### 底图图层

| 名称 | 类型 | 说明 |
|------|------|------|
| createOpenStreetMapLayer | `(data?: CreateOpenStreetMapLayerOptions) => TileLayer` | 创建 OpenStreetMap 瓦片图层 |
| createTianDiTuLayer | `(data: CreateTianDiTuLayerOptions) => TileLayer` | 创建天地图瓦片图层 |
| createTianDiTuUrl | `(data: CreateTianDiTuUrlOptions) => string` | 生成天地图瓦片 URL |
| createBingLayer | `(options: CreateBingLayerOptions) => TileLayer` | 创建 Bing 地图瓦片图层 |
| createXYZLayer | `(options: XYZLayerOptions) => TileLayer` | 创建通用 XYZ 瓦片图层 |
| createPMTilesLayer | `(config: PMTilesLayerOptions) => TileLayer` | 创建 PMTiles 矢量瓦片图层 |

### 矢量图层

| 名称 | 类型 | 说明 |
|------|------|------|
| createVectorSource | `<T>(options?: VectorSourceOptions<T>) => VectorSource` | 创建矢量数据源 |
| createVectorLayer | `<T>(options?: VectorLayerOptions<T>) => { source, layer }` | 创建矢量图层，返回 `{ source, layer }` |
| createWebGLVectorLayer | `<T>(options: WebGLVectorLayerOptions<T>) => { source, layer }` | 创建 WebGL 矢量图层，使用 FlatStyle，返回 `{ source, layer }` |
| createHeatmapLayer | `(options?: createHeatmapLayerOptions) => { layer, source }` | 创建热力图图层，返回 `{ layer, source }` |

### 画布图层

| 名称 | 类型 | 说明 |
|------|------|------|
| createCanvasLayer | `(olMap: OLMap, refresh: (frameState) => ..., options?: CanvasLayerOptions) => { layer }` | 创建 Canvas 图层，通过 `refresh` 回调逐帧绘制 |

### 主要类型

| 类型 | 说明 |
|------|------|
| `T_MAP_TYPE` | `'vec'\|'cva'\|'img'\|'cia'\|'ter'\|'cta'\|'ibo'` 天地图图层类型 |
| `CreateTianDiTuUrlOptions` | 天地图 URL 配置，含 `type`、`key`、`projection` 等 |
| `CreateTianDiTuLayerOptions` | 天地图图层配置，继承 `CreateTianDiTuUrlOptions`，额外含 `layerOptions`、`sourceOptions` |
| `CreateBingLayerOptions` | Bing 图层配置，含 `name`（影像集名称）、`key`、`layerOptions`、`sourceOptions` |
| `CreateOpenStreetMapLayerOptions` | OSM 图层配置，含 `layerOptions`、`sourceOptions` |
| `TileLayerOptions` | OpenLayers `TileLayer` 构造参数类型 |
| `XYZ_SourceOptions` | OpenLayers `XYZ` 构造参数类型 |
| `XYZLayerOptions` | XYZ 图层配置，含 `sourceOptions` 和 `TileLayerOptions` |
| `BingMapsSourceOptions` | OpenLayers `BingMaps` 构造参数类型 |
| `OpenStreetMapSourceOptions` | OpenLayers `OSM` 构造参数类型 |
| `VectorSourceOptions<T>` | `VectorSource` 构造参数类型 |
| `VectorLayerOptions<T>` | 矢量图层配置，含 `styleOptions`、`sourceOptions` 快捷字段 |
| `WebGLVectorLayerOptions<T>` | WebGL 矢量图层配置，必须含 `style: FlatStyleLike`，可选 `sourceOptions` |
| `PMTilesLayerOptions` | PMTiles 配置，含 `url` 和 `sourceOptions` |
| `CanvasLayerOptions` | Canvas 图层配置（OpenLayers `Layer` 构造参数） |
| `createHeatmapLayerOptions` | 热力图配置，含 `sourceOptions` 和 `HeatmapLayerOptions` |
| `HeatmapLayerOptions` | OpenLayers `HeatmapLayer` 构造参数类型 |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
