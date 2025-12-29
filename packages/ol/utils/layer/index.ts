import type { OLMap } from '@/types'
import type { StyleOptions } from '@/utils/style'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { FrameState } from 'ol/Map'
import type { FlatStyleLike } from 'ol/style/flat'
import { createTileGrid, EPSG_3857 } from '@/constants/projection'
import { createStyle } from '@/utils/style'
import { Layer, Tile as TileLayer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import WebGLVectorLayer from 'ol/layer/WebGLVector'
import { BingMaps, OSM, Source, XYZ } from 'ol/source'
import ImageTileSource from 'ol/source/ImageTile'
import VectorSource from 'ol/source/Vector'
import { PMTiles } from 'pmtiles'

export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo'

export interface CreateTianDiTuUrlOptions {
  url?: string
  key: string
  type: T_MAP_TYPE
  projection?: 'EPSG:3857' | 'EPSG:4326'
}

export function createTianDiTuUrl(data: CreateTianDiTuUrlOptions) {
  const { type = 'img', projection = EPSG_3857, key } = data
  const url = data.url || `https://t{0-4}.tianditu.gov.cn`
  const suffix
    = `&tk=${key
    // cSpell:disable-next-line
    }&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
  const proj = projection === EPSG_3857 ? 'w' : 'c'
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

export type ImageTileSourceOptions = ConstructorParameters<typeof ImageTileSource>[0]

export type PMTilesLayerOptions = TileLayerOptions & {
  url: string
  sourceOptions?: ImageTileSourceOptions
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', () => reject(new Error('load failed')))
    img.src = src
  })
}

export function createPMTilesLayer(config: PMTilesLayerOptions) {
  const { url, sourceOptions, ...layerOptions } = config
  const { projection, ...restSourceOptions } = sourceOptions || {}
  const tiles = new PMTiles(url)
  return new TileLayer({
    ...layerOptions,
    source: new ImageTileSource({
      async loader(z, x, y, { signal }) {
        const response = await tiles.getZxy(z, x, y, signal)
        const blob = new Blob([response!.data])
        const src = URL.createObjectURL(blob)
        const image = await loadImage(src)
        URL.revokeObjectURL(src)
        return image
      },
      crossOrigin: 'anonymous',
      tileGrid: createTileGrid(projection),
      ...restSourceOptions,
    }),
  })
}

export type XYZLayerOptions = TileLayerOptions & {
  sourceOptions: XYZ_SourceOptions
}

export function createXYZLayer({ sourceOptions, ...layerOptions }: XYZLayerOptions) {
  const { projection, ...restSourceOptions } = sourceOptions || {}
  return new TileLayer({
    ...layerOptions,
    source: new XYZ({
      crossOrigin: 'anonymous',
      ...restSourceOptions,
      tileGrid: createTileGrid(projection),
    }),
  })
}

export type CanvasLayerOptions = ConstructorParameters<typeof Layer>[0]

export function createCanvasLayer(olMap: OLMap, refresh: (frameState: FrameState) =>
  | {
    imageBitmap: ImageBitmap
    dpi: number
  }
  | undefined, options?: CanvasLayerOptions) {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.width = '100%'
  container.style.height = '100%'
  const _canvas = document.createElement('canvas')
  _canvas.style.width = '100%'
  _canvas.style.height = '100%'
  container.appendChild(_canvas)
  const ctx = _canvas.getContext('2d')!
  const config = {
    size: [0, 0],
    dpi: window.devicePixelRatio,
  }
  const source = new Source({})
  const layer = new Layer({
    render: (frameState) => {
      const size = frameState.size
      const res = refresh(frameState)

      if (res) {
        const { imageBitmap, dpi } = res
        if (dpi === config.dpi && size[0]! === config.size[0] && size[1]! === config.size[1]) {
          ctx.clearRect(0, 0, _canvas.width, _canvas.height)
        }
        else {
          config.size = [size[0]!, size[1]!]
          config.dpi = dpi
          _canvas.width = size[0]! * dpi
          _canvas.height = size[1]! * dpi
          ctx.scale(dpi, dpi)
        }
        ctx.drawImage(imageBitmap, 0, 0, size[0]!, size[1]!)
        imageBitmap.close()
      }
      else {
        ctx.clearRect(0, 0, _canvas.width, _canvas.height)
      }
      return container
    },
    source,
    ...options,
  })
  olMap.addLayer(layer)

  return { layer, source }
}
