import { Feature } from 'ol';
import {
  Circle,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom';
import { createStyle, type StyleOptions } from '../style';
import type { Style } from 'ol/style';
import type { Coordinate } from 'ol/coordinate';

export type FeatureOptions = {
  style?: Style;
  styleOptions?: StyleOptions;
  geometry?: Geometry;
  [key: string]: any;
};

export const createPoint = (coordinates: Coordinate) => {
  return new Point(coordinates);
};

export const createLineString = (coordinates: Coordinate[]) => {
  return new LineString(coordinates);
};

export const createPolygon = (coordinates: Coordinate[][]) => {
  return new Polygon(coordinates);
};

export const createCircle = (center: Coordinate, radius: number) => {
  return new Circle(center, radius);
};

export const createMultiPoint = (coordinates: Coordinate[]) => {
  return new MultiPoint(coordinates);
};

export const createMultiLineString = (coordinates: Coordinate[][]) => {
  return new MultiLineString(coordinates);
};

export const createMultiPolygon = (coordinates: Coordinate[][][]) => {
  return new MultiPolygon(coordinates);
};

export const createFeature = (options?: FeatureOptions) => {
  const { styleOptions, ...restOptions } = options ?? {};
  const style = styleOptions ? createStyle(styleOptions) : restOptions.style;
  const feature = new Feature({
    ...restOptions,
    style,
  });
  return feature;
};

export const createPointFeature = (coordinates: Coordinate, options?: FeatureOptions) => {
  const geometry = createPoint(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Point>;
};

export const createLineStringFeature = (coordinates: Coordinate[], options?: FeatureOptions) => {
  const geometry = createLineString(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<LineString>;
};

export const createPolygonFeature = (coordinates: Coordinate[][], options?: FeatureOptions) => {
  const geometry = createPolygon(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Polygon>;
};

export const createCircleFeature = (
  center: Coordinate,
  radius: number,
  options?: FeatureOptions
) => {
  const geometry = createCircle(center, radius);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Circle>;
};

export const createMultiPointFeature = (coordinates: Coordinate[], options?: FeatureOptions) => {
  const geometry = createMultiPoint(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiPoint>;
};

export const createMultiLineStringFeature = (
  coordinates: Coordinate[][],
  options?: FeatureOptions
) => {
  const geometry = createMultiLineString(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiLineString>;
};

export const createMultiPolygonFeature = (
  coordinates: Coordinate[][][],
  options?: FeatureOptions
) => {
  const geometry = createMultiPolygon(coordinates);
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiPolygon>;
};
