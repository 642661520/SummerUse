import type { T_MAP_TYPE } from '@summeruse/common'
import { ImageryLayer, OpenStreetMapImageryProvider, WebMapTileServiceImageryProvider } from 'cesium'

export type _WebMapTileServiceImageryProviderOptions = ConstructorParameters<typeof WebMapTileServiceImageryProvider>[0]

export type _ImageryLayerOptions = ConstructorParameters<typeof ImageryLayer>[1]

export interface GetTianDiTuLayerOptions {
  key: string
  type: T_MAP_TYPE
  imageryProviderOptions?: _WebMapTileServiceImageryProviderOptions
  imageryLayerOptions?: _ImageryLayerOptions
}

export function getTianDiTuLayer(data: GetTianDiTuLayerOptions) {
  const { key, type } = data
  const url = `http://t0.tianditu.gov.cn/${type}_w/wmts?tk=${key}`
  return new ImageryLayer(new WebMapTileServiceImageryProvider({
    url,
    layer: type,
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    ...data.imageryProviderOptions,
  }), data.imageryLayerOptions)
}

export function getOSMLayer() {
  return new ImageryLayer(
    new OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/',
    }),
  )
}
