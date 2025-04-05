import { Tile as TileLayer } from 'ol/layer';
import type { ProjectionLike } from 'ol/proj';
import { BingMaps, OSM, XYZ } from 'ol/source';
import { WebMercatorProjection, WGS84Projection } from '../../constants/projection';

export type T_MAP_TYPE = 'vec' | 'cva' | 'img' | 'ter' | 'cia' | 'eia';

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
