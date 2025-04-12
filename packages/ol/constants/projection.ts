/** 3857坐标系 墨卡托坐标系 */
export const EPSG_3857 = 'EPSG:3857'

/** 4326坐标系 经纬度坐标系 */
export const EPSG_4326 = 'EPSG:4326'

/** 3857坐标系 墨卡托坐标系 */
export const WebMercatorProjection = EPSG_3857

/** 4326坐标系 经纬度坐标系 */
export const WGS84Projection = EPSG_4326

export type ProjectionLike = 'EPSG:3857' | 'EPSG:4326'
