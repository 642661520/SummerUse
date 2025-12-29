import type { Projection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import { createXYZ } from 'ol/tilegrid'
import proj4 from 'proj4'

/** 3857坐标系 球面墨卡托投影坐标系 */
export const EPSG_3857 = 'EPSG:3857'

/** 4326坐标系 经纬度坐标系 等距圆柱投影 */
export const EPSG_4326 = 'EPSG:4326'

/** 3395坐标系 椭球墨卡托投影坐标系 */
export const EPSG_3395 = 'EPSG:3395'

export type ProjectionLike = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3395'

proj4.defs(
  'EPSG:3395',
  // cSpell:disable-next-line
  '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 ' + '+datum=WGS84 +units=m +no_defs +type=crs',
)

// 注册到 OpenLayers
register(proj4)

export function createTileGrid(ProjectionLike?: Projection | string) {
  if (ProjectionLike === EPSG_3395) {
    return createXYZ({
      extent: [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892],
    })
  }
}
