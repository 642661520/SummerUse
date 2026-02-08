import type { Map as OLMap } from 'ol'

export type { OLMap }

export type ForEachFeatureAtPixelCallbackOptions = Parameters<Parameters<OLMap['forEachFeatureAtPixel']>[1]>
export type LayerLike = ForEachFeatureAtPixelCallbackOptions[1]

export interface Option {
  [key: string]: any
}
