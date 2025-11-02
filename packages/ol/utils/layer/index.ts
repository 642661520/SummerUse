import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { ProjectionLike } from 'ol/proj'
import type { StyleOptions } from '@/utils/style'
import { Tile as TileLayer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import { BingMaps, OSM, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { WebMercatorProjection, WGS84Projection } from '@/constants/projection'
import { createStyle } from '@/utils/style'


export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo'

export interface CreateTianDiTuUrlOptions {
  url?: string
  key: string
  type: T_MAP_TYPE
  projection?: ProjectionLike
}

export function createTianDiTuUrl(data: CreateTianDiTuUrlOptions) {
  const { type = 'img', projection = WebMercatorProjection, key } = data
  const url = data.url || `https://t{0-4}.tianditu.gov.cn`
  const suffix
    = `&tk=${key
    // cSpell:disable-next-line
    }&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
  const proj
    = projection === WGS84Projection ? 'c' : projection === WebMercatorProjection ? 'w' : 'c'
  return `${url}/${type}_${proj}/wmts?LAYER=${type}${suffix}`
}

export type TileLayerOptions = Partial<ConstructorParameters<typeof TileLayer>[0]>

export type XYZ_SourceOptions = Partial<ConstructorParameters<typeof XYZ>[0]>

export type CreateTianDiTuLayerOptions = CreateTianDiTuUrlOptions & {
  layerOptions?: TileLayerOptions
  sourceOptions?: XYZ_SourceOptions
}

export function createTianDiTuLayer(data: CreateTianDiTuLayerOptions) {
  const { layerOptions, sourceOptions, ...options } = data
  return new TileLayer({
    source: new XYZ({
      url: createTianDiTuUrl(options),
      projection: options.projection,
      crossOrigin: 'Anonymous',
      ...sourceOptions,
    }),
    ...layerOptions,
  })
}

export type BingMapsSourceOptions = Partial<ConstructorParameters<typeof BingMaps>[0]>

export interface CreateBingLayerOptions {
  name: string
  key: string
  layerOptions?: TileLayerOptions
  sourceOptions?: BingMapsSourceOptions
}

export function createBingLayer({
  name,
  key,
  layerOptions,
  sourceOptions,
}: CreateBingLayerOptions) {
  const layer = new TileLayer({
    source: new BingMaps({
      key,
      imagerySet: name,
      placeholderTiles: false,
      ...sourceOptions,
    }),
    ...layerOptions,
  })
  return layer
}

export type OpenStreetMapSourceOptions = Partial<ConstructorParameters<typeof OSM>[0]>

export interface CreateOpenStreetMapLayerOptions {
  layerOptions?: TileLayerOptions
  sourceOptions?: BingMapsSourceOptions
}

export function createOpenStreetMapLayer(data?: CreateOpenStreetMapLayerOptions) {
  const { layerOptions, sourceOptions } = data || {}
  const layer = new TileLayer({
    source: new OSM({
      crossOrigin: 'Anonymous',
      ...sourceOptions,
    }),
    ...layerOptions,
  })
  return layer
}

export type _VectorLayerOptions = ConstructorParameters<typeof VectorLayer>[0]

export type VectorLayerOptions = _VectorLayerOptions & {
  styleOptions?: StyleOptions
}

export function createVectorLayer<T extends Geometry = Geometry>(options?: VectorLayerOptions) {
  const { styleOptions, ...restOptions } = options || {}
  const style = styleOptions ? createStyle(styleOptions) : undefined
  const source = new VectorSource<Feature<T>>()
  const layer = new VectorLayer({
    source,
    ...restOptions,
    style: style || restOptions.style,
  })
  return {
    source,
    layer,
  }
}
