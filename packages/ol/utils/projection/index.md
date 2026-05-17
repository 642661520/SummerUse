# 投影

<script lang="ts" setup>
import Demo from './demo.vue';
</script>

## 坐标系转换

<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

## API

### 坐标转换

| 名称 | 类型 | 说明 |
|------|------|------|
| EPSG_4326ToEPSG_3857 | `(coordinate: Coordinate) => Coordinate` | EPSG:4326 坐标转 EPSG:3857 |
| EPSG_3857ToEPSG_4326 | `(coordinate: Coordinate) => Coordinate` | EPSG:3857 坐标转 EPSG:4326 |

### 范围转换

| 名称 | 类型 | 说明 |
|------|------|------|
| EPSG_4326ExtentToEPSG_3857 | `(extent: Extent) => Extent` | EPSG:4326 范围转 EPSG:3857 |
| EPSG_3857ExtentToEPSG_4326 | `(extent: Extent) => Extent` | EPSG:3857 范围转 EPSG:4326 |

### 其他

| 名称 | 类型 | 说明 |
|------|------|------|
| registerEPSG_3395 | `() => void` | 注册 EPSG:3395 椭球墨卡托投影（通过 proj4），重复调用不生效 |
| createTileGrid | `(ProjectionLike?: Projection \| string) => XYZTileGrid \| undefined` | 根据投影创建 TileGrid，当前支持 EPSG:3395 |
| proj4 | `typeof proj4` | 直接导出 proj4 实例，用于自定义投影注册 |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
