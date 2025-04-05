import type { Coordinate } from 'ol/coordinate';
import { destination, lineString, length, area, polygon, bearing, midpoint } from '@turf/turf';
import { toOlAngle, toTurfAngle } from '../format';
import type { Extent } from 'ol/extent';

/** 计算已知方位距离的目标点
 * @param coordinates 起点坐标 WGS84 EPSG:4326
 * @param distance 距离，单位为米
 * @param azimuth 方位角，单位为度
 * @returns 目标点坐标 WGS84 EPSG:4326
 */
export const getDestinationPoint = (
  coordinates: Coordinate,
  distance: number,
  azimuth: number
): Coordinate => {
  return destination(coordinates, distance, toTurfAngle(azimuth), { units: 'meters' }).geometry
    .coordinates;
};

/** 计算线段的长度
 * @param coordinates 线段坐标 WGS84 EPSG:4326
 * @returns 线段长度，单位为米
 */
export const getLineLength = (coordinates: Coordinate[]): number => {
  const turfLineString = lineString(coordinates);
  return length(turfLineString, { units: 'meters' });
};

/** 计算面积 */
export const getArea = (coordinates: Coordinate[][]): number => {
  return area(polygon(coordinates));
};

/** 计算2点之间的角度 */
export const getAngle = (start: Coordinate, end: Coordinate): number => {
  return toOlAngle(bearing(start, end));
};

/** 计算2点的中心点 */
export const getCenter = (start: Coordinate, end: Coordinate): Coordinate => {
  return midpoint(start, end).geometry.coordinates;
};

/** 计算Extent中心点 */
export const getExtentCenter = (extent: Extent): Coordinate => {
  return getCenter([extent[0], extent[1]], [extent[2], extent[3]]);
};
