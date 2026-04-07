# SummerUse Code Wiki

## 目录

- [项目概述](#项目概述)
- [整体架构](#整体架构)
- [技术栈](#技术栈)
- [子项目详解](#子项目详解)
  - [@summeruse/ol](#summeruseol)
  - [@summeruse/cesium](#summerusecesium)
  - [@summeruse/layer](#summeruselayer)
  - [@summeruse/naive-ui](#summerusenaive-ui)
  - [@summeruse/turf](#summeruseturf)
  - [@summeruse/utils](#summeruseutils)
- [依赖关系](#依赖关系)
- [项目运行方式](#项目运行方式)
- [构建配置](#构建配置)
- [代码规范](#代码规范)

---

## 项目概述

**SummerUse** 是一个基于 Vue3 和 TypeScript 的前端工具库集合，采用 Monorepo 架构组织。项目旨在提供一套完整的前端开发工具，涵盖地图可视化、UI组件、弹窗层管理等多个领域。

| 属性 | 值 |
|------|-----|
| 项目名称 | @summeruse/monorepo |
| 包管理器 | pnpm@10.7.0 |
| 许可证 | ISC |
| 主页 | https://642661520.github.io/SummerUse/ |
| 仓库 | https://github.com/642661520/SummerUse |

---

## 整体架构

### Monorepo 结构

```
workspace/
├── packages/                    # 子项目目录
│   ├── .vitepress/             # VitePress 文档配置
│   ├── cesium/                 # Cesium 地图封装
│   ├── ol/                     # OpenLayers 地图封装
│   ├── layer/                  # 弹窗层组件
│   ├── naive-ui/               # NaiveUI 组件封装
│   ├── turf/                   # Turf.js 工具封装
│   ├── utils/                  # 通用工具函数
│   ├── guide/                  # 文档指南
│   └── public/                 # 静态资源
├── .changeset/                  # 版本管理配置
├── .github/                     # GitHub Actions 配置
├── .trae/                       # 项目规则配置
└── .vscode/                     # VSCode 配置
```

### 架构设计原则

1. **模块化设计**：每个子项目独立打包，可单独引用
2. **类型安全**：全面使用 TypeScript，提供完整类型定义
3. **Tree-shaking 友好**：支持 ESM/CJS/UMD 多种模块格式
4. **文档驱动**：使用 VitePress 构建交互式文档

---

## 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.5.13 | 前端框架 |
| TypeScript | ~5.7.2 | 类型系统 |
| Vite | rolldown-vite | 构建工具 |
| pnpm | 10.7.0 | 包管理器 |

### 地图库

| 库 | 版本 | 用途 |
|-----|------|------|
| OpenLayers | 10.7.0 | 2D 地图 |
| Cesium | ^1.128.0 | 3D 地球 |
| Turf.js | 7.2.0 | 地理计算 |

### UI 框架

| 框架 | 版本 | 用途 |
|------|------|------|
| Naive UI | ^2.41.0 | Vue3 组件库 |
| Element Plus | ^2.11.5 | Vue3 组件库 |
| Ant Design Vue | ^4.2.6 | Vue3 组件库 |

### 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| ESLint | ^9.24.0 | 代码检查 |
| Vitest | ^3.1.1 | 单元测试 |
| VitePress | ^2.0.0-alpha.12 | 文档生成 |
| UnoCSS | 66.5.4 | 原子化 CSS |
| Changesets | 2.29.8 | 版本管理 |

---

## 子项目详解

### @summeruse/ol

**OpenLayers Vue3 封装库**，提供声明式的地图开发体验。

#### 目录结构

```
packages/ol/
├── components/           # Vue 组件
│   └── ol-map/          # 地图容器组件
├── composables/          # 组合式函数
│   ├── useContextmenu/   # 右键菜单
│   ├── useDrawLineString/# 绘制线段
│   ├── useDrawPolygon/   # 绘制多边形
│   ├── useGraticule/     # 网格线
│   ├── useMapClick/      # 地图点击
│   ├── usePointermove/   # 鼠标悬停
│   └── useSwitchBaseLayer/# 切换底图
├── constants/            # 常量定义
│   ├── distance.ts       # 距离单位
│   └── projection.ts     # 投影定义
├── types/                # 类型定义
└── utils/                # 工具函数
    ├── distance/         # 距离计算
    ├── feature/          # 要素工具
    ├── layer/            # 图层工具
    ├── projection/       # 投影转换
    └── style/            # 样式工具
```

#### 核心组件

##### OlMap

地图容器组件，提供完整的地图初始化和交互控制。

**Props 定义：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| olMap | OLMap | new OLMap() | 地图实例 |
| center | Coordinate | [0, 0] | 地图中心点 |
| rotation | number | 0 | 旋转角度 |
| zoom | number | 2 | 缩放级别 |
| minZoom | number | 2 | 最小缩放 |
| maxZoom | number | 18 | 最大缩放 |
| projection | ProjectionLike | EPSG:3857 | 投影 |
| showZoom | boolean | false | 显示缩放控件 |
| showAttribution | boolean | false | 显示版权 |
| showRotate | boolean | false | 显示旋转控件 |
| showFullScreen | boolean | false | 显示全屏控件 |
| showOverview | boolean | false | 显示鹰眼 |
| showScale | boolean | false | 显示比例尺 |
| dragPan | boolean | true | 拖拽平移 |
| mouseWheelZoom | boolean | true | 滚轮缩放 |
| doubleClickZoom | boolean | false | 双击缩放 |
| pinchRotate | boolean | true | 双指旋转 |
| pinchZoom | boolean | true | 双指缩放 |
| altShiftDragRotate | boolean | false | Alt+Shift旋转 |

**Events：**

| 事件 | 参数 | 说明 |
|------|------|------|
| update:zoom | number | 缩放级别变化 |
| update:center | Coordinate | 中心点变化 |
| update:rotation | number | 旋转角度变化 |
| changeResolution | ObjectEvent | 分辨率变化 |
| changeRotation | ObjectEvent | 旋转变化 |
| changeCenter | ObjectEvent | 中心点变化 |
| moveend | MapEvent | 移动结束 |
| movestart | MapEvent | 移动开始 |

**使用示例：**

```vue
<template>
  <OlMap
    v-model:zoom="zoom"
    v-model:center="center"
    :show-zoom="true"
    :show-scale="true"
    @moveend="handleMoveEnd"
  >
    <template #default="{ olMap }">
      <!-- 地图内容 -->
    </template>
  </OlMap>
</template>

<script setup lang="ts">
import { OlMap, useOlMap } from '@summeruse/ol'

const zoom = ref(10)
const center = ref([116.4, 39.9])
</script>
```

#### 核心 Composables

##### usePointermove

鼠标悬停提示功能，支持优先级、自定义样式、动态内容。

```typescript
interface UsePointermoveOptions<T> {
  mapRef: MaybeRefOrGetter<OLMap | undefined>
  items: MaybeRefOrGetter<PointermoveList<T>>
  forceUpdate?: boolean
}

interface PointermoveItem {
  content?: string | ((params) => VNodeChild)
  visible?: boolean | ((params) => boolean)
  offset?: { x?: number, y?: number }
  priority?: number
  cursor?: Cursor | ((params) => Cursor)
  hitTolerance?: number
}

const {
  visible,      // 是否可见
  position,     // 提示位置
  feature,      // 当前要素
  content,      // 提示内容
  coordinate,   // 坐标
  hide,         // 隐藏方法
} = usePointermove({ mapRef, items })
```

##### useDrawPolygon

多边形绘制功能，支持修改、删除、样式自定义。

```typescript
interface DrawPolygonOptions {
  defaultCoordinates?: Coordinate[][][]
  deletePointLabel?: VNode
  deleteFeatureLabel?: VNode
  style?: Style
  styleOptions?: StyleOptions
  zIndex?: number
  size?: number
}

const {
  inDraw,       // 是否在绘制中
  start,        // 开始绘制
  stop,         // 停止绘制
  clear,        // 清空
  setFeatures,  // 设置坐标
  reset,        // 重置
  features,     // 要素列表
  coordinates,  // 坐标列表
  destroy,      // 销毁
} = useDrawPolygon(olMap, options)
```

#### 工具函数

##### createStyle

创建 OpenLayers 样式。

```typescript
interface StyleOptions {
  fill?: FillOptions
  stroke?: StrokeOptions
  image?: ImageOptions
  text?: TextOptions
}

const style = createStyle({
  fill: { color: 'rgba(255, 0, 0, 0.5)' },
  stroke: { color: 'red', width: 2 },
})
```

---

### @summeruse/cesium

**Cesium Vue3 封装库**，简化 3D 地球开发。

#### 目录结构

```
packages/cesium/
├── components/
│   ├── cesium-viewer/        # 地球容器
│   └── n-cesium-pointermove/ # 鼠标悬停提示
├── composables/
│   ├── createCesiumViewer/   # 创建 Viewer
│   ├── useCesiumLayer/       # 图层管理
│   └── useSwitchBaseLayer/   # 切换底图
└── utils/
    └── layer/                # 图层工具
```

#### 核心组件

##### CesiumViewer

Cesium 地球容器组件。

**Props：**

| 属性 | 类型 | 说明 |
|------|------|------|
| viewerOptions | ViewerOptions | Cesium Viewer 配置 |

**默认配置：**

```typescript
{
  baseLayer: false,
  shouldAnimate: true,
  infoBox: false,
  selectionIndicator: false,
  baseLayerPicker: false,
  timeline: false,
  animation: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  scene3DOnly: true,
}
```

**使用示例：**

```vue
<template>
  <CesiumViewer ref="viewerRef">
    <template #default="{ viewer }">
      <!-- 地球内容 -->
    </template>
  </CesiumViewer>
</template>

<script setup lang="ts">
import { CesiumViewer, useCesiumViewer } from '@summeruse/cesium'

const viewerRef = ref()
const viewer = useCesiumViewer()
</script>
```

#### 核心 Composables

##### createCesiumViewer

创建 Cesium Viewer 实例。

```typescript
function createCesiumViewer(
  element: MaybeRefOrGetter<HTMLElement | undefined>,
  options?: ViewerOptions
): { viewer: Viewer }
```

##### useCesiumLayer

管理 Cesium 数据源图层。

```typescript
const { layer, destroy } = useCesiumLayer({
  name: 'myLayer',
  viewer: viewer,
})
```

---

### @summeruse/layer

**弹窗层组件库**，提供可拖拽、可缩放的弹窗管理。

#### 目录结构

```
packages/layer/
├── components/
│   ├── layer/           # 弹窗组件
│   └── layer-provider/  # 弹窗管理器
└── composables/
    ├── injectLayer/     # 注入弹窗
    └── useLayer/        # 弹窗逻辑
        ├── drag.ts      # 拖拽逻辑
        ├── resize.ts    # 缩放逻辑
        └── types.ts     # 类型定义
```

#### 核心组件

##### Layer

可拖拽、可缩放的弹窗组件。

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| show | boolean | - | 显示状态 (v-model) |
| to | string | 'body' | Teleport 目标 |
| teleport | boolean | true | 是否传送 |
| destroyOnClose | boolean | true | 关闭时销毁 |
| initRect | Rect | - | 初始位置和尺寸 |
| disabledDrag | boolean | false | 禁用拖拽 |
| disabledResize | boolean | false | 禁用缩放 |
| onTop | boolean | false | 点击置顶 |
| minWidth | number | - | 最小宽度 |
| minHeight | number | - | 最小高度 |
| maxWidth | number | - | 最大宽度 |
| maxHeight | number | - | 最大高度 |
| ratio | number | - | 宽高比 |
| directions | Directions | - | 缩放方向 |

**Events：**

| 事件 | 参数 | 说明 |
|------|------|------|
| dragStart | Rect | 拖拽开始 |
| dragEnd | Rect | 拖拽结束 |
| resizeStart | Rect | 缩放开始 |
| resizeEnd | Rect | 缩放结束 |

**使用示例：**

```vue
<template>
  <Layer
    v-model:show="visible"
    :init-rect="{ x: 100, y: 100, width: 400, height: 300 }"
    :on-top="true"
  >
    <template #default="{ close }">
      <div class="layer-content">
        <button @click="close">关闭</button>
        <!-- 内容 -->
      </div>
    </template>
  </Layer>
</template>
```

##### LayerProvider

弹窗管理器，提供全局弹窗控制。

```vue
<template>
  <LayerProvider ref="providerRef">
    <App />
  </LayerProvider>
</template>

<script setup lang="ts">
import { LayerProvider, useLayerIndexManager } from '@summeruse/layer'

const providerRef = ref()

// 创建弹窗
const layer = providerRef.value?.create({
  initRect: { x: 100, y: 100, width: 300, height: 200 },
})

// 打开/关闭
layer.open()
layer.hide()
layer.destroy()
</script>
```

#### useLayer Composable

```typescript
interface LayerOptions {
  initRect?: MaybeRefOrGetter<Rect>
  parent?: MaybeRefOrGetter<HTMLElement>
  dragElement?: MaybeRefOrGetter<HTMLElement>
  disabledDrag?: MaybeRefOrGetter<boolean>
  disabledResize?: MaybeRefOrGetter<boolean>
  minWidth?: MaybeRefOrGetter<number>
  minHeight?: MaybeRefOrGetter<number>
  maxWidth?: MaybeRefOrGetter<number>
  maxHeight?: MaybeRefOrGetter<number>
  ratio?: MaybeRefOrGetter<number>
  directions?: MaybeRefOrGetter<Directions>
  allowOverParent?: MaybeRefOrGetter<boolean>
}

const {
  rect,       // 位置尺寸
  check,      // 边界检查
  isResize,   // 是否缩放中
  isDrag,     // 是否拖拽中
} = useLayer(target, options)
```

---

### @summeruse/naive-ui

**NaiveUI 组件封装**，提供开箱即用的配置。

#### 核心组件

##### NProvider

NaiveUI 全局配置提供者，集成消息、通知、对话框等 Provider。

**Props：**

| 属性 | 类型 | 说明 |
|------|------|------|
| locale | NLocale | 语言配置 |
| dateLocale | NDateLocale | 日期语言 |
| theme | BuiltInGlobalTheme | 主题 |
| themeOverrides | GlobalThemeOverrides | 主题覆盖 |
| globalStyle | boolean | 全局样式 |

**使用示例：**

```vue
<template>
  <NProvider :locale="zhCN" :date-locale="dateZhCN">
    <App />
  </NProvider>
</template>

<script setup lang="ts">
import { NProvider } from '@summeruse/naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>
```

---

### @summeruse/turf

**Turf.js 工具封装**，提供地理计算功能。

#### 目录结构

```
packages/turf/
├── calculate/          # 计算函数
├── format/             # 格式转换
├── realCircle/         # 真实圆
└── types/              # 类型定义
```

#### 核心函数

##### getDestinationPoint

计算已知方位距离的目标点。

```typescript
function getDestinationPoint(
  coordinates: Coordinate,  // 起点坐标 WGS84
  distance: number,         // 距离（米）
  azimuth: number           // 方位角（度）
): Coordinate
```

##### getLineLength

计算线段长度。

```typescript
function getLineLength(
  coordinates: Coordinate[]  // 线段坐标 WGS84
): number  // 长度（米）
```

##### getArea

计算多边形面积。

```typescript
function getArea(
  coordinates: Coordinate[][]  // 多边形坐标
): number  // 面积（平方米）
```

##### getAngle

计算两点之间的角度。

```typescript
function getAngle(
  start: Coordinate,
  end: Coordinate
): number  // 角度
```

---

### @summeruse/utils

**通用工具函数库**。

#### 目录结构

```
packages/utils/
└── scripts/
    ├── common.ts           # 通用工具
    ├── generateNav.ts      # 生成导航
    └── generateSidebar.ts  # 生成侧边栏
```

#### 核心函数

##### generateNavFromPackages

从 packages 目录自动生成 VitePress 导航配置。

```typescript
function generateNavFromPackages(options: {
  unifiedOrder: Record<string, number>
  exclude: string[]
  alias: Record<string, string>
}): NavItem[]
```

##### generateSidebarFromPackages

从 packages 目录自动生成 VitePress 侧边栏配置。

```typescript
function generateSidebarFromPackages(options: {
  unifiedOrder: Record<string, number>
  exclude: string[]
  alias: Record<string, string>
}): Sidebar
```

---

## 依赖关系

### 包依赖图

```
                    @summeruse/monorepo
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
@summeruse/ol      @summeruse/cesium   @summeruse/layer
        │                  │                  │
        │                  │                  ▼
        │                  │          @vueuse/core
        │                  │
        ▼                  ▼
      ol               cesium
                        naive-ui


@summeruse/naive-ui  @summeruse/turf   @summeruse/utils
        │                  │                  │
        ▼                  ▼                  ▼
    naive-ui          @turf/turf          globby
        │                  │
        ▼                  ▼
       vue                ol
```

### Peer Dependencies

| 包 | Peer Dependencies |
|-----|-------------------|
| @summeruse/ol | ol, vue |
| @summeruse/cesium | cesium, naive-ui, vue |
| @summeruse/layer | vue |
| @summeruse/naive-ui | vue |
| @summeruse/turf | ol, vue |

---

## 项目运行方式

### 环境要求

- Node.js >= 18
- pnpm >= 10.7.0

### 安装依赖

```bash
# 使用 npm registry 安装
pnpm run pnpm_install

# 或直接安装
pnpm install
```

### 开发命令

```bash
# 启动文档开发服务器
pnpm run docs:dev

# 构建文档
pnpm run docs:build

# 预览文档
pnpm run docs:preview

# 构建所有子项目
pnpm run build

# 代码检查
pnpm run lint

# 代码检查并修复
pnpm run lint:fix

# 运行测试
pnpm run test

# 测试覆盖率
pnpm run coverage
```

### 版本发布

```bash
# 添加 changeset
pnpm run changeset_add

# 进入预发布模式
pnpm run changeset_alpha   # alpha
pnpm run changeset_beta    # beta
pnpm run changeset_rc      # rc

# 退出预发布模式
pnpm run changeset_pre_exit

# 更新版本号
pnpm run changeset_version

# 发布到 npm
pnpm run changeset_publish
```

---

## 构建配置

### 构建工具

项目使用两种构建方式：

1. **Vite 构建**（cesium, turf）
   - 使用 `vue-tsc` 进行类型检查
   - 输出 ESM/CJS/UMD 格式
   - 使用 `vite-plugin-dts` 生成类型声明

2. **tsdown 构建**（ol, layer, naive-ui, utils）
   - 基于 esbuild 的快速构建
   - 输出 ESM/CJS/IIFE 格式

### 输出格式

| 包 | Main | Module | UMD | Types |
|-----|------|--------|-----|-------|
| @summeruse/ol | dist/index.js | dist/index.js | dist/index.iife.min.js | dist/index.d.ts |
| @summeruse/cesium | lib/index.js | es/index.mjs | dist/index.js | es/index.d.ts |
| @summeruse/layer | dist/index.js | dist/index.js | dist/index.iife.min.js | dist/index.d.ts |
| @summeruse/naive-ui | dist/index.js | dist/index.js | dist/index.iife.min.js | dist/index.d.ts |
| @summeruse/turf | lib/index.js | es/index.mjs | dist/index.js | es/index.d.ts |
| @summeruse/utils | dist/index.cjs | dist/index.mjs | - | dist/index.d.ts |

---

## 代码规范

### ESLint 配置

项目使用 `@antfu/eslint-config` 作为基础配置：

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  typescript: true,
  ignores: ['dist', 'node_modules', '**/*.d.ts', '**/*.setup.ts'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
})
```

### TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "es2020",
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "Bundler",
    "strict": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "declaration": true
  }
}
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `OlMap`, `CesiumViewer` |
| Composable | camelCase + use前缀 | `usePointermove`, `useDrawPolygon` |
| 工具函数 | camelCase | `createStyle`, `getDestinationPoint` |
| 常量 | UPPER_SNAKE_CASE | `olMapInjectionKey` |
| 类型 | PascalCase | `OlMapProps`, `DrawPolygonOptions` |

---

## 注入键 (Injection Keys)

项目使用 Vue 的 provide/inject 机制进行依赖注入：

| Key | 类型 | 提供者 | 用途 |
|-----|------|--------|------|
| `olMapInjectionKey` | OLMap | OlMap | 注入地图实例 |
| `cesiumViewerInjectionKey` | Viewer | CesiumViewer | 注入地球实例 |
| `layerProviderInjectionKey` | LayerProvider | LayerProvider | 注入弹窗管理器 |
| `layerIndexManagerKey` | LayerIndexManager | LayerProvider | 注入层级管理器 |

---

## 测试

### 测试框架

- **Vitest**：单元测试框架
- **@vue/test-utils**：Vue 组件测试工具
- **jsdom**：DOM 模拟环境

### 测试配置

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm coverage
```

---

## 文档系统

### VitePress 配置

文档使用 VitePress 2.0 构建，配置位于 `packages/.vitepress/config.mts`。

#### 自动导航生成

```typescript
const nav_sidebar_config = {
  unifiedOrder: {
    'guide': 0,
    'ol': 1,
    'cesium': 2,
    'naive-ui': 3,
    'layer': 4,
    'turf': 5,
    'components': 10,
    'composables': 11,
    'utils': 12,
    'constants': 13,
    'CHANGELOG': 999,
  },
  exclude: ['**/README.md', 'packages/ui'],
  alias: {
    CHANGELOG: '更新日志',
    guide: '指南',
  },
}
```

#### 文档开发

```bash
# 启动文档开发服务器
pnpm docs:dev

# 构建静态文档
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

---

## GitHub Actions

项目使用 GitHub Actions 进行自动部署：

```yaml
# .github/workflows/deploy.yml
# 自动构建并部署到 GitHub Pages
```

---

## 总结

SummerUse 是一个功能完善的前端工具库集合，具有以下特点：

1. **模块化架构**：采用 Monorepo 组织，各子项目独立发布
2. **类型安全**：全面使用 TypeScript，提供完整类型定义
3. **地图可视化**：支持 OpenLayers 和 Cesium 两大地图库
4. **组件化开发**：提供声明式的 Vue3 组件
5. **完善的文档**：使用 VitePress 构建交互式文档
6. **现代化工具链**：使用 Vite、pnpm、ESLint 等现代工具

项目适用于需要地图可视化、弹窗管理等功能的前端项目，可以按需引入所需的子包。
