# useContextmenu

## 简介

提供右键菜单逻辑，支持多级菜单，ui需要自己实现，可参考使用示例。

## 使用示例

<script lang="ts" setup>
import NDemo from './n-demo.vue'
import EDemo from './e-demo.vue'
import ADemo from './a-demo.vue'
import Demo from './demo.vue'
</script>

### Overlay + 自定义UI
<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

### 结合NaiveUI

使用NaiveUI的 [`Dropdown`](https://www.naiveui.com/zh-CN/os-theme/components/dropdown) 组件实现多级右键菜单。

<ClientOnly>
<NDemo />
</ClientOnly>

::: details 点我查看代码
::: code-group
<<<./n-demo.vue
<<<./n-ol-contextmenu-demo.vue
:::

### 结合ElementPlus

使用ElementPlus的 [`Dropdown`](https://element-plus.org/zh-CN/component/dropdown.html) 组件实现单级右键菜单。

<ClientOnly>
<EDemo />
</ClientOnly>

### 结合AntDesignVue

使用AntDesignVue的 [`Menu`](https://www.antdv.com/components/menu-cn) 组件实现二级右键菜单。

<ClientOnly>
<ADemo />
</ClientOnly>

<br />

::: details 点我查看代码
::: code-group
<<<./a-demo.vue
<<<./a-ol-contextmenu-demo.vue
:::

## API

| 名称 | 类型 |
|--------|--------|
| useContextmenu | (...args: [UseContextmenuParams](#UseContextmenuParams)) => [UseContextmenuReturn](#UseContextmenuReturn) |

### UseContextmenuParams {#UseContextmenuParams}

| 名称   | 类型   | 默认值 | 说明 |
|--------|--------|--------|------|
| args[0]  | `MaybeRefOrGetter<OLMap \| undefined>` | - | 地图实例 |
| args[1]  | `MaybeRefOrGetter<ContextmenuItem[]>` | - | 菜单项配置 |

### UseContextmenuReturn {#UseContextmenuReturn}

| 名称 | 类型 | 说明 |
|------|------|------|
| visible | ComputedRef&lt;boolean&gt; | 菜单是否可见 |
| position | ComputedRef&lt;[ContextmenuPosition](#ContextmenuPosition)&gt; | 菜单当前位置 |
| feature | ComputedRef&lt;FeatureLike \| undefined&gt; | 触发菜单的要素 |
| options | ComputedRef&lt;[ContextmenuOption](#ContextmenuOption)[]&gt; | 当前可显示的菜单项 |
| hide | () => void | 关闭菜单 |

### ContextmenuItem {#ContextmenuItem}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| label | ((params: [ContextmenuItemParams](#ContextmenuItemParams)) => VNodeChild) \| string | - | 菜单项文本 |
| visible | ((params: [ContextmenuItemParams](#ContextmenuItemParams)) => boolean) \| boolean | true | 是否可见 |
| disabled | ((params: [ContextmenuItemParams](#ContextmenuItemParams)) => boolean) \| boolean | false | 是否禁用 |
| action | (params: [ContextmenuItemParams](#ContextmenuItemParams)) => void | - | 点击回调 |
| children | ContextmenuItem[] | - | 子项 |
| divided | boolean | false | 是否显示分割线 |
| icon | ((params: [ContextmenuItemParams](#ContextmenuItemParams)) => VNodeChild) \| string | - | 图标 |
| order | number | - | 排序 |
| key | string | - | 唯一键 |

### ContextmenuOption {#ContextmenuOption}

| 名称 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| label | string \| (() => VNodeChild) | - | 菜单项文本 |
| visible |  boolean | true | 是否可见 |
| disabled |  boolean | false | 是否禁用 |
| action | () => void | - | 点击回调 |
| children | ContextmenuOption[] | - | 子项 |
| divided | boolean | false | 是否显示分割线 |
| icon | string \| (() => VNodeChild) | - | 图标 |
| order | number | - | 排序 |
| key | string | - | 唯一键 |

### ContextmenuItemParams {#ContextmenuItemParams}

| 名称 | 类型 | 说明 |
|------|------|------|
| map  | OLMap | 地图实例 |
| position | ContextmenuPosition | 菜单位置 |
| coordinate | Coordinate | 点击的坐标 |
| feature | FeatureLike | 点击的feature |
| layer | LayerLike | 点击的图层 |

### ContextmenuPosition {#ContextmenuPosition}

| 名称 | 类型 | 说明 |
|------|------|------|
| x | number | 菜单横坐标 |
| y | number | 菜单纵坐标 |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
