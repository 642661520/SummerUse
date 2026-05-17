# 样式

## 创建样式

`createStyle`

调用了 `createTextStyle` 和 `createCircleStyle` 两个方法，分别用于创建文本样式和点样式。

<script lang="ts" setup>
import Demo from './demo.vue';
</script>

<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

## API

### 工厂函数

| 名称 | 类型 | 说明 |
|------|------|------|
| createStyle | `(options: StyleOptions) => Style` | 创建通用样式，自动组装 fill/stroke/image/text |
| createCircleStyle | `(options: CircleOptions) => Circle` | 创建圆形样式（用于点要素） |
| createTextStyle | `(options: TextOptions) => Text` | 创建文本样式（用于标注） |

### StyleOptions {#StyleOptions}

继承 OpenLayers `Style` 构造参数，额外扩展：

| 名称 | 类型 | 说明 |
|------|------|------|
| fillOptions | [`FillOptions`](#FillOptions) | Fill 样式配置 |
| strokeOptions | [`StrokeOptions`](#StrokeOptions) | Stroke 样式配置 |
| iconOptions | `IconOptions` | Icon 样式配置 |
| circleOptions | [`CircleOptions`](#CircleOptions) | Circle 样式配置 |
| textOptions | [`TextOptions`](#TextOptions) | Text 样式配置 |

### CircleOptions {#CircleOptions}

继承 OpenLayers `Circle` 构造参数，额外扩展：

| 名称 | 类型 | 说明 |
|------|------|------|
| fillOptions | [`FillOptions`](#FillOptions) | 填充样式 |
| strokeOptions | [`StrokeOptions`](#StrokeOptions) | 描边样式 |

### TextOptions {#TextOptions}

继承 OpenLayers `Text` 构造参数，额外扩展：

| 名称 | 类型 | 说明 |
|------|------|------|
| fillOptions | [`FillOptions`](#FillOptions) | 文字颜色 |
| strokeOptions | [`StrokeOptions`](#StrokeOptions) | 文字描边 |
| backgroundFillOptions | [`FillOptions`](#FillOptions) | 背景填充 |
| backgroundStrokeOptions | [`StrokeOptions`](#StrokeOptions) | 背景描边 |

### 基础类型

| 类型 | 说明 |
|------|------|
| FillOptions | OpenLayers `Fill` 构造参数 |
| StrokeOptions | OpenLayers `Stroke` 构造参数 |
| IconOptions | OpenLayers `Icon` 构造参数 |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
