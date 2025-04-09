import type { Coordinate } from 'ol/coordinate';
import { transform, transformExtent } from 'ol/proj';
import { EPSG_3857, EPSG_4326 } from '../../constants';
import type { Extent } from 'ol/extent';

/** WGS84坐标转墨卡托  */
export const wgs84ToMercator = (coordinate: Coordinate) => {
  return transform(coordinate, EPSG_4326, EPSG_3857);
};
/** WGS84坐标转墨卡托  */
export const EPSG_4326ToEPSG_3857 = wgs84ToMercator;

/** 墨卡托坐标转WGS84 */
export const mercatorToWgs84 = (coordinate: Coordinate) => {
  return transform(coordinate, EPSG_3857, EPSG_4326);
};
/** 墨卡托坐标转WGS84 */
export const EPSG_3857ToEPSG_4326 = mercatorToWgs84;

/** WGS84范围转墨卡托 */
export const wgs84ExtentToMercator = (extent: Extent) => {
  return transformExtent(extent, EPSG_4326, EPSG_3857);
};
/** WGS84范围转墨卡托 */
export const EPSG_4326ExtentToEPSG_3857 = wgs84ExtentToMercator;

/** 墨卡托范围转WGS84 */
export const mercatorExtentToWgs84 = (extent: Extent) => {
  return transformExtent(extent, EPSG_3857, EPSG_4326);
};

/** 墨卡托范围转WGS84 */
export const EPSG_3857ExtentToEPSG_4326 = mercatorExtentToWgs84;
