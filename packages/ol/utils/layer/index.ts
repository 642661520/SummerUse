import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { ProjectionLike } from 'ol/proj'
import type { StyleOptions } from '../style'
import { Tile as TileLayer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import { BingMaps, OSM, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { WebMercatorProjection, WGS84Projection } from '../../constants/projection'
import { createStyle } from '../style'

export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo'

export function getTianDiTuUrl(data: {
  url?: string
  type: T_MAP_TYPE
  projection: ProjectionLike
  key: string
}) {
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

export function getTianDiTuLayer(data: {
  url?: string
  projection: ProjectionLike
  zIndex?: number
  key: string
  type: T_MAP_TYPE
  className?: string
}) {
  const { zIndex, projection, className } = data
  return new TileLayer({
    className,
    source: new XYZ({
      url: getTianDiTuUrl(data),
      projection,
      crossOrigin: 'Anonymous',
    }),
    zIndex,
  })
}

export function getBingLayer({
  name,
  zIndex,
  key,
  className,
}: {
  name: string
  zIndex?: number
  key: string
  className?: string
}) {
  const layer = new TileLayer({
    className,
    source: new BingMaps({
      key,
      imagerySet: name,
      placeholderTiles: false,
    }),
    zIndex,
  })
  return layer
}

export function getOSMLayer(data?: { zIndex?: number, className?: string }) {
  const layer = new TileLayer({
    className: data?.className,
    source: new OSM({
      crossOrigin: 'Anonymous',
    }),
    zIndex: data?.zIndex,
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
