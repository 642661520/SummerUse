import type { Cesium3DTileFeature, Entity, ScreenSpaceEventHandler, Viewer } from 'cesium'
import type { PopoverPlacement } from 'naive-ui'

import type { VNodeChild } from 'vue'

export interface NCesiumPointermoveOptions {
  movement: ScreenSpaceEventHandler.MotionEvent
  feature?: Cesium3DTileFeature | Entity
}

export type CreateOptions = (data: NCesiumPointermoveOptions) =>
  | {
    content: (() => VNodeChild) | VNodeChild | string
    raw?: boolean
    showArrow?: boolean
    placement?: PopoverPlacement
  }
  | undefined

export interface NCesiumPointermoveProps {
  viewer?: Viewer
  createOptions: CreateOptions
}
