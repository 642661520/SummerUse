import { ONE_NM } from '../../constants'

/** 公里转海里 */
export function kmToNauticalMiles(km: number) {
  return (km * 1000) / ONE_NM
}

/** 海里转公里 */
export function nauticalMilesToKm(nauticalMiles: number) {
  return (nauticalMiles * ONE_NM) / 1000
}

/** 弧度转角度 */
export function rotationToAngle(rotation: number): number {
  return formatRotation(rotation) * 180 / Math.PI
}

/** 角度转弧度 */
export function angleToRotation(angle: number): number {
  return formatAngle(angle) * Math.PI / 180
}

/** 格式化Rotation */
export function formatRotation(rotation: number): number {
  if (rotation < 0) {
    return formatRotation(rotation + 2 * Math.PI)
  }
  if (rotation > 2 * Math.PI) {
    return formatRotation(rotation - 2 * Math.PI)
  }
  return rotation
}

/** 格式化角度 */
export function formatAngle(angle: number): number {
  if (angle < 0) {
    return formatAngle(angle + 360)
  }
  if (angle >= 360) {
    return formatAngle(angle - 360)
  }
  return angle
}
