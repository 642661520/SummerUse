# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

SummerUse 是一个 pnpm monorepo，包含基于 Vue 3 + TypeScript 的地图和 UI 工具库集合。使用 pnpm catalog 统一管理依赖版本。

## 常用命令

```bash
# 构建所有包
pnpm build                  # pnpm -r run build

# 测试
pnpm test                   # vitest（watch 模式）
pnpm coverage               # vitest run --coverage

# 代码检查
pnpm lint                   # eslint
pnpm lint:fix               # eslint --fix

# 文档
pnpm docs:dev               # vitepress dev packages（端口 8080）
pnpm docs:build             # vitepress build packages

# 版本管理（changesets）
pnpm changeset_add           # 添加变更集
pnpm changeset_version       # 生成版本号
pnpm changeset_publish       # 发布到 npm
```

## 包结构

| 包名 | 构建工具 | 说明 |
|------|---------|------|
| `@summeruse/ol` | tsdown | OpenLayers 封装（composables、组件、工具函数） |
| `@summeruse/cesium` | vite | Cesium 封装（Viewer 创建、图层管理） |
| `@summeruse/layer` | tsdown | 可拖拽/缩放的弹窗层组件 |
| `@summeruse/naive-ui` | tsdown | 基于 NaiveUI 的封装组件 |
| `@summeruse/turf` | vite | Turf.js 地理计算工具 |
| `@summeruse/utils` | tsdown | 通用工具（文档生成脚本等） |

## 构建系统

- **tsdown**（rolldown 驱动）：入口为包根目录的 `index.ts`，通过 `unplugin-vue/rolldown` 支持 `.vue` SFC。配置在 `tsdown.config.ts`。
- **vite**：入口为包根目录的 `index.ts`，通过 `@vitejs/plugin-vue` + `vite-plugin-dts` + `vite-plugin-css-injected-by-js` 构建。配置在 `vite.config.ts`。

tsdown 包的依赖通过约定自动外置，`noExternal` 可强制打包指定依赖（如 `pmtiles`、`proj4`）。vite 包需显式声明 `external`。

## 代码组织模式

每个功能模块是一个独立目录，包含：
- `index.ts` — 导出入口（barrel export）
- `index.vue` — 组件 SFC（如适用）
- `index.md` — Vitepress 文档页面
- `index.test.ts` — 测试文件
- `props.ts` — 组件 Props 定义（如适用）
- `demo.vue` — 文档演示（如适用）
- `types.ts` — 类型定义（如适用）

上层 `components/index.ts`、`composables/index.ts` 等 barrel 文件汇总导出各子模块。

## 关键架构约定

### Vue Composables 模式（ol 包）

Composables 遵循 Vue 3 Composition API 模式，接收 `MaybeRefOrGetter` 类型的 reactive 参数，返回 computed refs 和操作方法。地图相关的 composable 使用以下事件绑定模式：

```ts
watch(() => toValue(mapRef), (newMap, oldMap) => {
  if (oldMap)
    unbindMapEvents(oldMap)
  if (newMap)
    bindMapEvents(newMap)
}, { immediate: true })
```

`mapRef` 通过 `MaybeRefOrGetter<OLMap | undefined>` 传入，支持响应式切换地图实例。

### 优先级+容差分组模式

`useMapClick` 和 `usePointermove` 都使用相同的"按 priority 排序，相邻相同 hitTolerance 合并"策略：先按 priority 降序排列 items，再将相邻相同 tolerance 的 item 合并到同一组，每组用 `forEachFeatureAtPixel` 只检测一次。

### Cesium 依赖注入

Cesium Viewer 通过 Vue `provide/inject` 传递，使用 `cesiumViewerInjectionKey` 作为 injection key。组件从注入的 viewer 获取 Cesium 实例，不直接创建。

### Layer 弹窗组件（@summeruse/layer）

`useLayer` composable 管理可拖拽+8方向缩放的弹窗。通过 `@vueuse/core` 的 `useEventListener` 绑定拖拽/缩放事件，`useResizeObserver` 监听父容器尺寸变化。

## 类型导出模式

包的类型在 `types/index.ts` 中集中定义。常用模式：从第三方库的类型中提取子类型（如 `ForEachFeatureAtPixelCallbackOptions`）。导出时同时导出类型别名和 `export type` 从第三方包 re-export 的类型。

## 文档

Vitepress 文档站部署在 GitHub Pages（`/SummerUse/` base path）。导航和侧边栏通过 `@summeruse/utils` 的 `generateNavFromPackages` / `generateSidebarFromPackages` 根据 packages 目录下的 markdown 文件自动生成。排序通过 frontmatter 的 `order` 字段或 vitepress config 中的 `unifiedOrder` 控制。
