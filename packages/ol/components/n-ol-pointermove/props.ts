import type { PopoverPlacement } from 'naive-ui'
import type { Map as OLMap } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { Pixel } from 'ol/pixel'
import type { VNodeChild } from 'vue'

export interface NOlPointermoveParams {
  pixel: Pixel
  coordinate: Coordinate
  features: FeatureLike[]
}

export type NOlPointermoveOption = {
  content: (() => VNodeChild) | VNodeChild | string
  raw?: boolean
  showArrow?: boolean
  placement?: PopoverPlacement
  // 跟随鼠标 | 跟随要素
  followTarget?: 'mouse' | 'feature'
} | undefined

export interface NOlPointermoveProps {
  olMap: OLMap
  createOptions: (data: NOlPointermoveParams) => NOlPointermoveOption
}
