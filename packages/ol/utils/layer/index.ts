import { Tile as TileLayer } from 'ol/layer';
import type { ProjectionLike } from 'ol/proj';
import { BingMaps, OSM, XYZ } from 'ol/source';
import { WebMercatorProjection, WGS84Projection } from '../../constants/projection';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import type { Geometry } from 'ol/geom';
import type { Feature } from 'ol';
import { createStyle, type StyleOptions } from '../style';

/**
 * 天地图类型
 * vec: 矢量底图
 * cva: 矢量注记
 * img: 影像底图
 * cia: 影像注记
 * ter: 地形晕渲
 * cta: 地形注记
 * ibo: 全球境界
 */
export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo';

export const getTianDiTuUrl = (data: {
  url?: string;
  type: T_MAP_TYPE;
  projection: ProjectionLike;
  key: string;
}) => {
  const { type = 'img', projection = WebMercatorProjection, key } = data;
  const url = data.url || `https://t{0-4}.tianditu.gov.cn`;
  const suffix =
    '&tk=' +
    key +
    // cSpell:disable-next-line
    '&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  const proj =
    projection === WGS84Projection ? 'c' : projection === WebMercatorProjection ? 'w' : 'c';
  return url + '/' + type + '_' + proj + '/wmts?LAYER=' + type + suffix;
};

export const getTianDiTuLayer = (data: {
  url?: string;
  projection: ProjectionLike;
  zIndex?: number;
  key: string;
  type: T_MAP_TYPE;
  className?: string;
}) => {
  const { zIndex, projection, className } = data;
  return new TileLayer({
    className,
    source: new XYZ({
      url: getTianDiTuUrl(data),
      projection,
      crossOrigin: 'Anonymous',
    }),
    zIndex,
  });
};

export const getBingLayer = ({
  name,
  zIndex,
  key,
  className,
}: {
  name: string;
  zIndex?: number;
  key: string;
  className?: string;
}) => {
  const layer = new TileLayer({
    className,
    source: new BingMaps({
      key: key,
      imagerySet: name,
      placeholderTiles: false,
    }),
    zIndex,
  });
  return layer;
};

export const getOSMLayer = (data?: { zIndex?: number; className?: string }) => {
  const layer = new TileLayer({
    className: data?.className,
    source: new OSM({
      crossOrigin: 'Anonymous',
    }),
    zIndex: data?.zIndex,
  });
  return layer;
};

export type _VectorLayerOptions = ConstructorParameters<typeof VectorLayer>[0];

export type VectorLayerOptions = _VectorLayerOptions & {
  styleOptions?: StyleOptions;
};

export const createVectorLayer = <T extends Geometry = Geometry>(options?: VectorLayerOptions) => {
  const { styleOptions, ...restOptions } = options || {};
  const style = styleOptions ? createStyle(styleOptions) : undefined;
  const source = new VectorSource<Feature<T>>();
  const layer = new VectorLayer({
    source,
    ...restOptions,
    style: style || restOptions.style,
  });
  return {
    source,
    layer,
  };
};
