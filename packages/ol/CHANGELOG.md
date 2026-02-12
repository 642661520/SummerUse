# @summeruse/ol

## 0.6.1

### Patch Changes

- 8b4a43e: fix(utils/layer): 允许刷新函数返回布尔值以控制画布清除

## 0.6.0

### Minor Changes

- 6a8ca7e: feat(composables): 新增 useMapClick 组合式函数处理地图点击事件

### Patch Changes

- d727683: feat(usePointermove): 支持 hitTolerance 并按容差分组优化检测性能

## 0.5.1

### Patch Changes

- 774051c: feat(utils): 添加弧度与角度转换函数
- 112feb2: feat(ol-map): 添加地图旋转支持

## 0.5.0

### Minor Changes

- 0e7124d: feat(图层工具): 添加热力图图层创建功能

## 0.4.2

### Patch Changes

- 054bfbf: 修复 xyz，pmtiles 图层坐标系未导入

## 0.4.1

### Patch Changes

- 6833ec1: refactor(projection): 统一使用 EPSG 代码命名坐标转换函数
- 33fb1b2: refactor(projection): 将投影相关代码移动到 utils 目录并优化初始化逻辑

## 0.4.0

### Minor Changes

- 39823a8: refactor(build): 迁移构建工具从 vite 到 tsdown

### Patch Changes

- 32919a6: feat(图层工具): 添加 PMTiles 和 XYZ 图层创建功能及 Canvas 图层支持
- d005413: fix(utils/layer): 修正 CreateOpenStreetMapLayerOptions 中的 sourceOptions 类型
- a3138b4: feat(投影): 添加 EPSG:3395 椭球墨卡托投影支持

## 0.3.3

### Patch Changes

- a224dda: refactor(style): 优化样式创建逻辑以支持直接传入样式对象
- 2085d50: refactor(utils/layer): 优化矢量图层创建函数，支持直接传入 style 和 source

## 0.3.2

### Patch Changes

- 92af465: refactor(ol-map): 添加组件名称定义以提升可维护性
- 432f073: feat(图层工具): 添加 WebGL 矢量图层支持并重构矢量图层创建逻辑

## 0.3.1

### Patch Changes

- 779d07c: feat(usePointermove): 添加原始坐标存储并修复中心点计算

## 0.3.0

### Minor Changes

- 95fc65d: refactor(usePointermove): 重构指针移动事件处理逻辑

## 0.2.0

### Minor Changes

- c2ad696: 将 n-ol-pointermove 组件重构为 usePointermove 组合式函数
- 6fbc681: 重构右键菜单功能为组合式 API
- f605ee4: 移除对 naive-ui 的依赖并调整相关配置

### Patch Changes

- fd8d77c: 修复 createFeature 中样式不生效
- 9275a0b: refactor(utils): 移除计算和格式化工具模块
- 66a195e: refactor(utils/layer): 移除 T_MAP_TYPE 的外部依赖并内联定义
- 93d2746: refactor(usePointermove): 重构指针移动逻辑并添加新配置选项
- 3317ecf: feat(utils): 添加角度和旋转格式化函数
- c466dde: build(ol): 清理 package.json 中未使用的依赖项
- 03fc086: feat(ol-map): 添加地图事件监听和 emit 功能
- ba32d77: refactor(utils/layer): 重构地图图层工具函数，优化类型定义和参数结构

## 0.2.0-alpha.3

### Patch Changes

- 93d2746: refactor(usePointermove): 重构指针移动逻辑并添加新配置选项
- 03fc086: feat(ol-map): 添加地图事件监听和 emit 功能

## 0.2.0-alpha.2

### Patch Changes

- 3317ecf: feat(utils): 添加角度和旋转格式化函数
- ba32d77: refactor(utils/layer): 重构地图图层工具函数，优化类型定义和参数结构

## 0.2.0-alpha.1

### Patch Changes

- 9275a0b: refactor(utils): 移除计算和格式化工具模块
- 66a195e: refactor(utils/layer): 移除 T_MAP_TYPE 的外部依赖并内联定义
- c466dde: build(ol): 清理 package.json 中未使用的依赖项

## 0.2.0-alpha.0

### Minor Changes

- c2ad696: 将 n-ol-pointermove 组件重构为 usePointermove 组合式函数
- 6fbc681: 重构右键菜单功能为组合式 API
- f605ee4: 移除对 naive-ui 的依赖并调整相关配置

### Patch Changes

- fd8d77c: 修复 createFeature 中样式不生效

## 0.1.7

### Patch Changes

- Updated dependencies [7c820e9]
  - @summeruse/common@0.2.0

## 0.1.6

### Patch Changes

- Updated dependencies [1803eaf]
- Updated dependencies [8ecccee]
  - @summeruse/common@0.1.3

## 0.1.5

### Patch Changes

- Updated dependencies [7ad4250]
- Updated dependencies [e972e37]
  - @summeruse/common@0.1.2

## 0.1.4

### Patch Changes

- Updated dependencies [9e56bea]
  - @summeruse/common@0.1.1

## 0.1.3

### Patch Changes

- e682b46: fix: 移除 defineProps 导入
- Updated dependencies [dbeece1]
- Updated dependencies [d3d0faf]
  - @summeruse/common@0.1.0

## 0.1.2

### Patch Changes

- 007fa24: n-ol-pointermove 的 createOptions 添加 `followTarget` 参数

## 0.1.2-beta.0

### Patch Changes

- 007fa24: n-ol-pointermove 的 createOptions 添加 `followTarget` 参数

## 0.1.1

### Patch Changes

- c26ae5a: 重构 useGraticule 以支持更灵活的样式配置
- e651b52: 添加经纬度标签样式支持
- b0985c6: 添加 useOlMap 函数以简化地图实例的注入
- 9b9aeed: 移除`T_MAP_TYPE`类型的定义，改为从`@summeruse/common`导入
- Updated dependencies [8619680]
  - @summeruse/common@0.0.1

## 0.1.1-beta.2

### Patch Changes

- Updated dependencies [8619680]
  - @summeruse/common@0.0.1-beta.0
- b0985c6: 添加 useOlMap 函数以简化地图实例的注入
- 9b9aeed: 移除`T_MAP_TYPE`类型的定义，改为从`@summeruse/common`导入

## 0.1.1-beta.1

### Patch Changes

- e651b52: 添加经纬度标签样式支持

## 0.1.1-beta.0

### Patch Changes

- c26ae5a: 重构 useGraticule 以支持更灵活的样式配置

## 0.1.0

### Minor Changes

- 8e34a3f: 添加 useDrawLineString useDrawPolygon
- b6b95dc: 添加创建几何要素的实用函数
- 58c1e99: 添加坐标系相关函数的注释
- 474d537: 添加常数模块
- 474d537: 添加工具函数模块
- 1d0394b: 添加创建样式的工具函数
- 4739812: 添加创建矢量图层的函数
- c0a970d: 添加`vite-plugin-css-injected-by-js`插件以将 CSS 注入 JS 文件
- 474d537: 添加 ol-map 组件
- 474d537: 添加 useGraticule
- 474d537: 添加 useSwitchBaseLayer
- 048ca5d: 修复：天地图类型
- a0c76b5: style(n-ol-pointermove): 移除冗余的样式并改用 theme-overrides
- 062b2f0: 添加 useDrawLineString
- 474d537: 添加 n-ol-pointermove

## 0.0.1-beta.5

### Patch Changes

- b6b95dc: 添加创建几何要素的实用函数
- 58c1e99: 添加坐标系相关函数的注释
- 1d0394b: 添加创建样式的工具函数
- 4739812: 添加创建矢量图层的函数
- c0a970d: 添加`vite-plugin-css-injected-by-js`插件以将 CSS 注入 JS 文件
- 048ca5d: 修复：天地图类型
- a0c76b5: style(n-ol-pointermove): 移除冗余的样式并改用 theme-overrides

## 0.0.1-beta.4

### Patch Changes

- 添加 useDrawPolygon
- 添加 useDrawLineString

## 0.0.1-beta.3

### Patch Changes

- 添加常数模块
- 添加工具函数模块

## 0.0.1-beta.2

### Patch Changes

- 添加 ol-map 组件
- 添加 useGraticule
- 添加 useSwitchBaseLayer
- 添加 n-ol-pointermove

## 0.0.1-beta.0

### Patch Changes

- 更新 ol-contextmenu Props 类型
