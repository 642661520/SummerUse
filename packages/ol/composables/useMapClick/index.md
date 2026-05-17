# useMapClick

## 简介

在地图要素上处理点击事件（单击、双击、`singleclick`）。支持按优先级匹配、可见性动态判断、相邻相同 `hitTolerance` 合并检测，适合"点击要素弹出信息窗"等交互场景。

底层通过 `useMapClickHandler` 实现事件绑定，`useMapClick` 是对其的封装，提供按 key 增删点击配置项的能力。

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

- 支持通过泛型携带自定义配置类型：`useMapClick<T extends Record<string, any>>(mapRef, type)`。
- `ClickConfig<T>` 中除 `hitTolerance`、`priority`、`visible`、`handler` 以外的字段都会保留在配置项中，可在 `handler` 中通过闭包访问。

示例：

```ts
const { add, remove } = useMapClick<{ id: string }>(olMap, 'singleclick')

add('my-handler', [{
  id: 'feature-1',
  handler: (ctx) => {
    // ctx 为 ClickContext
  },
}])
```

## API

| 名称 | 类型 |
|--------|--------|
| useMapClick | `<T>`(`mapRef`, `type`) => [`UseMapClickReturn`](#UseMapClickReturn) |
| useMapClickHandler | `<T>`(`options`: [`UseClickHandlerOptions<T>`](#UseClickHandlerOptions)) => `void` |

### useMapClick {#useMapClick}

| 参数 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| mapRef | `MaybeRefOrGetter<OLMap \| undefined>` | - | 地图实例 |
| type | [`ClickEventType`](#ClickEventType) | - | 事件类型 |

### UseMapClickReturn {#UseMapClickReturn}

| 名称 | 类型 | 说明 |
|------|------|------|
| add | `(key: string, items: ClickConfigList<T>) => void` | 添加一组点击配置，相同 key 会覆盖 |
| remove | `(key: string) => void` | 移除指定 key 的点击配置 |

### useMapClickHandler {#useMapClickHandler}

底层 composable，直接传入配置列表和地图实例。适用于不需要按 key 管理配置项的场景。

### UseClickHandlerOptions`<T>` {#UseClickHandlerOptions}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| mapRef | `MaybeRefOrGetter<OLMap \| undefined>` | - | 地图实例 |
| items | `MaybeRefOrGetter<ClickConfigList<T>>` | - | 点击配置列表 |
| type | [`ClickEventType`](#ClickEventType) | - | 事件类型 |

### ClickEventType {#ClickEventType}

```ts
type ClickEventType = 'click' | 'dblclick' | 'singleclick'
```

### ClickConfig`<T>` {#ClickConfig}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| handler | `(context: ClickContext) => void` | - | 点击回调 |
| hitTolerance | `number` | `0` | Hit-detection 容差（css 像素） |
| priority | `number` | `0` | 优先级，数字越大越优先 |
| visible | `(context: ClickContext) => boolean \| undefined \| void` | - | 是否响应此点击 |
| 其他字段 | `...args: T` | - | 通过泛型扩展的自定义属性 |

### ClickContext {#ClickContext}

| 名称 | 类型 | 说明 |
|------|------|------|
| map | `OLMap` | 地图实例 |
| coordinate | `Coordinate` | 点击位置的地图坐标 |
| pixel | `Pixel` | 点击位置的像素坐标 |
| feature | `FeatureLike \| undefined` | 命中的要素 |
| layer | `LayerLike` | 要素所在图层 |

### 类型别名

| 名称 | 类型 | 说明 |
|------|------|------|
| ClickConfigList`<T>` | `ClickConfig<T>[]` | 点击配置列表 |

## 使用说明

- 同一 `type` 建议只调用一次 `useMapClick`，通过 `add`/`remove` 管理不同场景的点击配置。
- 当有多个配置项匹配时，按 `priority` 从高到低、`hitTolerance` 相邻相同分组的策略检测。
- `visible` 为函数时可动态判断是否响应点击（如根据要素属性决定）。
- 支持响应式切换地图实例，`mapRef` 变化时自动重新绑定事件。

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
