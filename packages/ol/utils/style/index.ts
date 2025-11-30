import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'

export type FillOptions = ConstructorParameters<typeof Fill>[0]
export type StrokeOptions = ConstructorParameters<typeof Stroke>[0]
export type IconOptions = ConstructorParameters<typeof Icon>[0]
export type _StyleOptions = ConstructorParameters<typeof Style>[0]
export type _CircleOptions = ConstructorParameters<typeof Circle>[0]
export type _TextOptions = ConstructorParameters<typeof Text>[0]

export type CircleOptions = _CircleOptions & {
  fillOptions?: FillOptions
  strokeOptions?: StrokeOptions
}

export type TextOptions = _TextOptions & {
  fillOptions?: FillOptions
  strokeOptions?: StrokeOptions
  backgroundFillOptions?: FillOptions
  backgroundStrokeOptions?: StrokeOptions
}

export type StyleOptions = _StyleOptions & {
  fillOptions?: FillOptions
  strokeOptions?: StrokeOptions
  iconOptions?: IconOptions
  circleOptions?: CircleOptions
  textOptions?: TextOptions
}

export function createCircleStyle(options: CircleOptions) {
  const { fillOptions, strokeOptions, ...rest } = options
  return new Circle({
    ...rest,
    fill: fillOptions ? new Fill(fillOptions) : undefined,
    stroke: strokeOptions ? new Stroke(strokeOptions) : undefined,
  })
}

export function createTextStyle(options: TextOptions) {
  const { fillOptions, strokeOptions, backgroundFillOptions, backgroundStrokeOptions, ...rest }
    = options
  return new Text({
    ...rest,
    fill: fillOptions ? new Fill(fillOptions) : undefined,
    stroke: strokeOptions ? new Stroke(strokeOptions) : undefined,
    backgroundFill: backgroundFillOptions ? new Fill(backgroundFillOptions) : undefined,
    backgroundStroke: backgroundStrokeOptions ? new Stroke(backgroundStrokeOptions) : undefined,
  })
}

export function createStyle(options: StyleOptions) {
  const { fillOptions, strokeOptions, iconOptions, circleOptions, textOptions, stroke: _stroke, image: _image, fill: _fill, text: _text, ...rest } = options
  const fill = _fill || (fillOptions ? new Fill(fillOptions) : undefined)
  const stroke = _stroke || (strokeOptions ? new Stroke(strokeOptions) : undefined)
  const image = _image || (iconOptions ? new Icon(iconOptions) : (circleOptions ? createCircleStyle(circleOptions) : undefined))
  const text = _text || (textOptions ? createTextStyle(textOptions) : undefined)
  return new Style({
    ...rest,
    fill,
    stroke,
    image,
    text,
  })
}
