import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'
import type { Projection } from 'ol/proj'
import { get as getProjection, transform, transformExtent } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import { createXYZ } from 'ol/tilegrid'
import proj4 from 'proj4'

import { EPSG_3395, EPSG_3857, EPSG_4326 } from '../../constants'
/**  EPSG_4326转EPSG_3857 */
export function EPSG_4326ToEPSG_3857(coordinate: Coordinate) {
  return transform(coordinate, EPSG_4326, EPSG_3857)
}

/** EPSG_3857转EPSG_4326 */
export function EPSG_3857ToEPSG_4326(coordinate: Coordinate) {
  return transform(coordinate, EPSG_3857, EPSG_4326)
}

/** EPSG_4326范围转EPSG_3857 */
export function EPSG_4326ExtentToEPSG_3857(extent: Extent) {
  return transformExtent(extent, EPSG_4326, EPSG_3857)
}

/** EPSG_3857范围转EPSG_4326 */
export function EPSG_3857ExtentToEPSG_4326(extent: Extent) {
  return transformExtent(extent, EPSG_3857, EPSG_4326)
}

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
