# usePointermove

## 简介

在地图要素上移动鼠标时，提供悬浮提示（tooltip）逻辑。支持优先级匹配、可见性动态判断、位置偏移、是否固定在要素中心、以及自定义鼠标样式等。提示的 UI 需自行结合组件库实现（示例使用 NaiveUI 的 [`Popover`](https://www.naiveui.com/zh-CN/os-theme/components/popover)）。

## 使用示例

<script lang="ts" setup>
import Demo from './demo.vue'
</script>

<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

## 泛型扩展 {#Option}

- 支持通过泛型携带自定义配置类型：`usePointermove<T extends Record<string, any>>(mapRef, items: MaybeRefOrGetter<PointermoveItem<T>[]>)`。
- 当命中提示项时，返回的 `option` 为 `ComputedRef<T | undefined>`，内容为该项除 `content`、`cursor`、`visible`、`fixedFeatureCenter`、`offset`、`priority` 以外的所有自定义字段。

示例：

```ts
const { option } = usePointermove<{ id: string }>(olMap, [{
  content: '信息',
  id: 'feature-id',
}])
// option.value?.id === 'feature-id'
```


## API

| 名称 | 类型 |
|--------|--------|
| usePointermove | `<T>`(...args: [`UsePointermoveParams<T>`](#UsePointermoveParams)) => [`UsePointermoveReturn`](#UsePointermoveReturn) |

### UsePointermoveParams`<T>` {#UsePointermoveParams}

| 名称   | 类型   | 默认值 | 说明 |
|--------|--------|--------|------|
| args[0]  | `MaybeRefOrGetter<OLMap \| undefined>` | - | 地图实例 |
| args[1]  | `MaybeRefOrGetter<PointermoveItem<T>[]>` | - | 提示项配置列表 |

### UsePointermoveReturn {#UsePointermoveReturn}

| 名称 | 类型 | 说明 |
|------|------|------|
| visible | ComputedRef&lt;boolean&gt; | 提示是否可见 |
| offset | ComputedRef&lt;{ x: number, y: number }&gt; | 位置偏移 |
| position | ComputedRef&lt;[PointermovePosition](#PointermovePosition)&gt; | 提示当前位置（像素坐标） |
| originalPosition | ComputedRef&lt;[PointermovePosition](#PointermovePosition)&gt; | 原始位置（鼠标事件触发位置） |
| feature | ComputedRef&lt;FeatureLike \| undefined&gt; | 当前命中的要素 |
| content | ComputedRef&lt;(() => VNodeChild) \| string&gt; | 提示内容，支持函数或字符串 |
| coordinate | ComputedRef&lt;Coordinate \| undefined&gt; | 当前命中的地图坐标 |
| hide | () => void | 关闭提示并恢复鼠标样式 |
| [option](#Option) | ComputedRef&lt;T \| undefined&gt; | 当前命中的提示项自定义配置（来自匹配项的其他字段） |

### PointermoveItem {#PointermoveItem}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| content | ((params: [PointermoveContentParams](#PointermoveContentParams)) => VNodeChild) \| string | - | 提示内容，支持函数动态生成 |
| visible | ((params: [PointermoveContentParams](#PointermoveContentParams)) => boolean) \| boolean | true | 是否显示提示 |
| offset | `{ x?: number, y?: number }` | `{ x: 0, y: 0 }` | 位置偏移 |
| priority | number | 0 | 优先级，数字越大优先显示 |
| cursor | `CSSProperties['cursor']` \| ((params: [PointermoveContentParams](#PointermoveContentParams)) => `CSSProperties['cursor']`) | - | 鼠标样式，如 `pointer`、`crosshair` 等 |
| fixedFeatureCenter | boolean | true | 是否固定在要素中心位置 |
| 其他字段 | ...args: [Option](#Option) | - | 通过泛型扩展的自定义属性 |



### PointermoveContentParams {#PointermoveContentParams}

| 名称 | 类型 | 说明 |
|------|------|------|
| map | OLMap | 地图实例 |
| position | [PointermovePosition](#PointermovePosition) | 提示位置（像素坐标） |
| coordinate | Coordinate | 当前命中的地图坐标 |
| feature | FeatureLike | 当前命中的要素 |
| layer | LayerLike \| undefined | 要素所在图层 |

### PointermovePosition {#PointermovePosition}

| 名称 | 类型 | 说明 |
|------|------|------|
| x | number | 横坐标（像素） |
| y | number | 纵坐标（像素） |

## 使用说明

- 仅当指针位于某个要素上时才显示提示；离开要素则隐藏。
- 当有多个提示项匹配时，按 `priority` 从高到低选择一个显示。
- `content` 为函数时将接收 [PointermoveContentParams](#PointermoveContentParams)，可按需生成内容或返回组件。
- `cursor` 可设置地图视口的鼠标样式；调用 `hide` 会恢复原始样式。
- `fixedFeatureCenter` 为 `true` 时，提示位置会锚定在要素中心；否则锚定在当前鼠标位置。

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
