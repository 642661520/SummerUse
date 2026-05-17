# 距离单位

<script lang="ts" setup>
import Demo from './demo.vue';
</script>

## 公里/海里转换

<ClientOnly>
<Demo />
</ClientOnly>

::: details 点我查看代码
<<<./demo.vue
:::

## API

### 单位转换

| 名称 | 类型 | 说明 |
|------|------|------|
| kmToNauticalMiles | `(km: number) => number` | 公里转海里 |
| nauticalMilesToKm | `(nauticalMiles: number) => number` | 海里转公里 |

### 角度/弧度转换

| 名称 | 类型 | 说明 |
|------|------|------|
| rotationToAngle | `(rotation: number) => number` | 弧度转角度 |
| angleToRotation | `(angle: number) => number` | 角度转弧度 |
| formatRotation | `(rotation: number) => number` | 格式化弧度到 [0, 2π) 范围 |
| formatAngle | `(angle: number) => number` | 格式化角度到 [0, 360) 范围 |

## 源代码

::: details 点我查看代码
<<<./index.ts
:::
