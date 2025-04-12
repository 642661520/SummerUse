import type { Coordinate } from 'ol/coordinate'
import { getDestinationPoint } from '../calculate'

/**
 * 获取一个地理圆形的坐标点
 * @param coordinate 中心坐标 EPSG:4326 WGS84
 * @param radius  单位：米
 * @param  [sides] 边数
 * @returns 伪圆形坐标 EPSG:4326 WGS84
 */
export function getRealCircleCoordinates(coordinate: Coordinate, radius: number, sides: number = 60) {
  const points = []
  const step = 360 / sides
  for (let i = -180; i < 180; i = i + step) {
    points.push(getDestinationPoint(coordinate, radius, i))
  }
  return [points]
}
