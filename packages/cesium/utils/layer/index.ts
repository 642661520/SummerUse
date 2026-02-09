import { ImageryLayer, OpenStreetMapImageryProvider, WebMapTileServiceImageryProvider } from 'cesium'

export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo'

export type _WebMapTileServiceImageryProviderOptions = Partial<ConstructorParameters<typeof WebMapTileServiceImageryProvider>[0]>

export type _ImageryLayerOptions = ConstructorParameters<typeof ImageryLayer>[1]

export interface GetTianDiTuLayerOptions {
  key: string
  type: T_MAP_TYPE
  imageryProviderOptions?: _WebMapTileServiceImageryProviderOptions
  imageryLayerOptions?: _ImageryLayerOptions
}

export function createTianDiTuLayer(data: GetTianDiTuLayerOptions) {
  const { key, type } = data
  const url = `https://t0.tianditu.gov.cn/${type}_w/wmts?tk=${key}`
  return new ImageryLayer(new WebMapTileServiceImageryProvider({
    url,
    layer: type,
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    ...data.imageryProviderOptions,
  }), data.imageryLayerOptions)
}

export function createOpenStreetMapLayer() {
  return new ImageryLayer(
    new OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/',
    }),
  )
}
