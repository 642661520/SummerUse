import type { StyleOptions } from '@/utils/style'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { ProjectionLike } from 'ol/proj'
import type { FlatStyleLike } from 'ol/style/flat'
import { WebMercatorProjection, WGS84Projection } from '@/constants/projection'
import { createStyle } from '@/utils/style'
import { Tile as TileLayer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import WebGLVectorLayer from 'ol/layer/WebGLVector'
import { BingMaps, OSM, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'

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
  sourceOptions?: OpenStreetMapSourceOptions
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

export type _VectorSourceOptions<T extends Geometry = Geometry> = ConstructorParameters<typeof VectorSource<Feature<T>>>[0]

export type VectorSourceOptions<T extends Geometry = Geometry> = _VectorSourceOptions<T>

export function createVectorSource<T extends Geometry = Geometry>(options?: VectorSourceOptions<T>) {
  return new VectorSource<Feature<T>>({
    ...options,
  })
}

export type _VectorLayerOptions<T extends Geometry = Geometry> = ConstructorParameters<typeof VectorLayer<VectorSource<Feature<T>>>>[0]

export type VectorLayerOptions<T extends Geometry = Geometry> = _VectorLayerOptions<T> & {
  styleOptions?: StyleOptions
  sourceOptions?: VectorSourceOptions<T>
}

export function createVectorLayer<T extends Geometry = Geometry>(options?: VectorLayerOptions<T>) {
  const { styleOptions, sourceOptions, style: _style, source: _source, ...restOptions } = options || {}
  const style = _style || (styleOptions ? createStyle(styleOptions) : undefined)
  const source = _source || createVectorSource<T>(sourceOptions)
  const layer = new VectorLayer({
    ...restOptions,
    source,
    style,
  })
  return {
    source,
    layer,
  }
}

export type _WebGLVectorLayerOptions<T extends Geometry = Geometry> = ConstructorParameters<typeof WebGLVectorLayer<VectorSource<Feature<T>>>>[0]

export type WebGLVectorLayerOptions<T extends Geometry = Geometry> = _WebGLVectorLayerOptions<T> & {
  style: FlatStyleLike
  sourceOptions?: VectorSourceOptions<T>
}

export function createWebGLVectorLayer<T extends Geometry = Geometry>(options: WebGLVectorLayerOptions<T>) {
  const { style, source: _source, sourceOptions, ...restOptions } = options
  const source = _source || createVectorSource<T>(sourceOptions)
  const layer = new WebGLVectorLayer({
    ...restOptions,
    source,
    style,
  })
  return {
    source,
    layer,
  }
}
