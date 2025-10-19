import type { Coordinate } from 'ol/coordinate'
import type {
  Geometry,
} from 'ol/geom'
import type { Style } from 'ol/style'
import type { StyleOptions } from '../style'
import { Feature } from 'ol'
import {
  Circle,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom'
import { createStyle } from '../style'

export interface FeatureOptions {
  style?: Style
  styleOptions?: StyleOptions
  geometry?: Geometry
  [key: string]: any
}

export function createPoint(coordinates: Coordinate) {
  return new Point(coordinates)
}

export function createLineString(coordinates: Coordinate[]) {
  return new LineString(coordinates)
}

export function createPolygon(coordinates: Coordinate[][]) {
  return new Polygon(coordinates)
}

export function createCircle(center: Coordinate, radius: number) {
  return new Circle(center, radius)
}

export function createMultiPoint(coordinates: Coordinate[]) {
  return new MultiPoint(coordinates)
}

export function createMultiLineString(coordinates: Coordinate[][]) {
  return new MultiLineString(coordinates)
}

export function createMultiPolygon(coordinates: Coordinate[][][]) {
  return new MultiPolygon(coordinates)
}

export function createFeature(options?: FeatureOptions) {
  const { styleOptions, style, geometry, ...restOptions } = options ?? {}
  const _style = styleOptions ? createStyle(styleOptions) : style
  const feature = new Feature({
    geometry,
    ...restOptions,
  })
  feature.setStyle(_style)
  return feature
}

export function createPointFeature(coordinates: Coordinate, options?: FeatureOptions) {
  const geometry = createPoint(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Point>
}

export function createLineStringFeature(coordinates: Coordinate[], options?: FeatureOptions) {
  const geometry = createLineString(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<LineString>
}

export function createPolygonFeature(coordinates: Coordinate[][], options?: FeatureOptions) {
  const geometry = createPolygon(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Polygon>
}

export function createCircleFeature(center: Coordinate, radius: number, options?: FeatureOptions) {
  const geometry = createCircle(center, radius)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<Circle>
}

export function createMultiPointFeature(coordinates: Coordinate[], options?: FeatureOptions) {
  const geometry = createMultiPoint(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiPoint>
}

export function createMultiLineStringFeature(coordinates: Coordinate[][], options?: FeatureOptions) {
  const geometry = createMultiLineString(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiLineString>
}

export function createMultiPolygonFeature(coordinates: Coordinate[][][], options?: FeatureOptions) {
  const geometry = createMultiPolygon(coordinates)
  return createFeature({
    ...options,
    geometry,
  }) as Feature<MultiPolygon>
}
