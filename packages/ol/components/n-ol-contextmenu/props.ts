import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import type { Map as OLMap } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { Pixel } from 'ol/pixel'

export interface NOlContextmenuOptions {
  event: MouseEvent
  pixel: Pixel
  coordinate: Coordinate
  features: FeatureLike[]
}

export interface NOlContextmenuProps {
  olMap: OLMap
  createOptions: (options: NOlContextmenuOptions) => (DropdownMixedOption & {
    onClick?: (options: NOlContextmenuOptions) => void
  })[]
}
