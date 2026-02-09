# @summeruse/layer

## 0.1.1

### Patch Changes

- 2129df9: fix(layer): 使用 nextTick 延迟设置 rect 以避免更新冲突

## 0.1.0

### Minor Changes

- 5cd3aed: build(layer): 迁移构建工具从 Vite 到 tsdown

### Patch Changes

- 75e5eda: refactor(useLayer): 将 parent 类型从 MaybeRefOrGetter 更新为 MaybeComputedElementRef
- dfa179d: refactor(layer): 使用 props 替代 defineModel 管理初始矩形

## 0.0.6

### Patch Changes

- b089095: test

## 0.0.5

### Patch Changes

- b6534a0: refactor(layer): 更新拖拽和缩放事件以传递矩形参数

## 0.0.4

### Patch Changes

- 7ca10ea: feat(useLayer): 添加拖拽状态标识 isDrag
- 22fde00: feat(components/layer): 添加拖拽和缩放开始结束事件

## 0.0.3

### Patch Changes

- fbca875: refactor(layer): 重命名 UseLayerOptions 为 CreateLayerOptions
- b728df8: refactor(composables): 重命名 DialogApiInjection 为 LayerApi 以更准确描述用途
- fb1c59a: fix(layer): 将 content 属性从可选改为必填
- 7cd5a6a: feat(layer): 添加 open 方法和 hideAll 功能

## 0.0.2

### Patch Changes

- e78e201: feat(components): 为 Layer 和 InjectLayer 组件添加 name 选项
- 521fdf4: fix(useLayer): 修复元素宽高为 0 时使用窗口宽高的问题

## 0.0.1

### Patch Changes

- 130bbe3: feat(layer): 新增基于 Teleport 的可调整大小和位置的弹窗层组件库

## 0.0.1-alpha.0

### Patch Changes

- 130bbe3: feat(layer): 新增基于 Teleport 的可调整大小和位置的弹窗层组件库
