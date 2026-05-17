# 要素

## 创建要素

`createFeature`

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

### geometry 工厂

创建原生 OpenLayers geometry 对象：

| 名称 | 类型 | 说明 |
|------|------|------|
| createPoint | `(coordinates: Coordinate) => Point` | 创建点 |
| createLineString | `(coordinates: Coordinate[]) => LineString` | 创建线段 |
| createPolygon | `(coordinates: Coordinate[][]) => Polygon` | 创建多边形 |
| createCircle | `(center: Coordinate, radius: number) => Circle` | 创建圆形 |
| createMultiPoint | `(coordinates: Coordinate[]) => MultiPoint` | 创建多点 |
| createMultiLineString | `(coordinates: Coordinate[][]) => MultiLineString` | 创建多线 |
| createMultiPolygon | `(coordinates: Coordinate[][][]) => MultiPolygon` | 创建多多边形 |

### Feature 工厂

创建带样式的 Feature 对象：

| 名称 | 类型 | 说明 |
|------|------|------|
| createFeature | `(options?: FeatureOptions) => Feature` | 创建要素 |
| createPointFeature | `(coordinates: Coordinate, options?: FeatureOptions) => Feature<Point>` | 创建点要素 |
| createLineStringFeature | `(coordinates: Coordinate[], options?: FeatureOptions) => Feature<LineString>` | 创建线段要素 |
| createPolygonFeature | `(coordinates: Coordinate[][], options?: FeatureOptions) => Feature<Polygon>` | 创建多边形要素 |
| createCircleFeature | `(center: Coordinate, radius: number, options?: FeatureOptions) => Feature<Circle>` | 创建圆形要素 |
| createMultiPointFeature | `(coordinates: Coordinate[], options?: FeatureOptions) => Feature<MultiPoint>` | 创建多点要素 |
| createMultiLineStringFeature | `(coordinates: Coordinate[][], options?: FeatureOptions) => Feature<MultiLineString>` | 创建多线要素 |
| createMultiPolygonFeature | `(coordinates: Coordinate[][][], options?: FeatureOptions) => Feature<MultiPolygon>` | 创建多多边形要素 |

### FeatureOptions {#FeatureOptions}

| 名称 | 类型 | 说明 |
|------|------|------|
| geometry | `Geometry` | OpenLayers geometry 对象 |
| style | `Style` | OpenLayers Style 对象 |
| styleOptions | [`StyleOptions`](../style/index.md#StyleOptions) | 样式配置，优先级低于 `style` |
| ...rest | `Record<string, any>` | 自定义数据字段，会存入 Feature 的 properties |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
