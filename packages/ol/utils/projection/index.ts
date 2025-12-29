import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'
import type { Projection } from 'ol/proj'
import { get as getProjection, transform, transformExtent } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import { createXYZ } from 'ol/tilegrid'
import proj4 from 'proj4'

import { EPSG_3395, EPSG_3857, EPSG_4326 } from '../../constants'
/** WGS84坐标转墨卡托  */
export function wgs84ToMercator(coordinate: Coordinate) {
  return transform(coordinate, EPSG_4326, EPSG_3857)
}
/** WGS84坐标转墨卡托  */
export const EPSG_4326ToEPSG_3857 = wgs84ToMercator

/** 墨卡托坐标转WGS84 */
export function mercatorToWgs84(coordinate: Coordinate) {
  return transform(coordinate, EPSG_3857, EPSG_4326)
}
/** 墨卡托坐标转WGS84 */
export const EPSG_3857ToEPSG_4326 = mercatorToWgs84

/** WGS84范围转墨卡托 */
export function wgs84ExtentToMercator(extent: Extent) {
  return transformExtent(extent, EPSG_4326, EPSG_3857)
}
/** WGS84范围转墨卡托 */
export const EPSG_4326ExtentToEPSG_3857 = wgs84ExtentToMercator

/** 墨卡托范围转WGS84 */
export function mercatorExtentToWgs84(extent: Extent) {
  return transformExtent(extent, EPSG_3857, EPSG_4326)
}

/** 墨卡托范围转WGS84 */
export const EPSG_3857ExtentToEPSG_4326 = mercatorExtentToWgs84

export function registerEPSG_3395() {
  if (getProjection(EPSG_3395)) {
    return
  }
  proj4.defs(
    'EPSG:3395',
    // cSpell:disable-next-line
    '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 ' + '+datum=WGS84 +units=m +no_defs +type=crs',
  )
  register(proj4)
}

export function createTileGrid(ProjectionLike?: Projection | string) {
  if (ProjectionLike === EPSG_3395) {
    registerEPSG_3395()
    return createXYZ({
      extent: [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892],
    })
  }
}

export { proj4 }
