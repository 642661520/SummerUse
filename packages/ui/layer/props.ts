import type { Directions } from '@summeruse/common'
import type { RendererElement } from 'vue'

export interface LayerProps {
  to?: string | RendererElement | null | undefined
  // 是否弹出到Teleport
  teleport?: boolean
  // 方向
  directions?: Directions
  // 拖动元素
  dragElement?: HTMLElement
  // 禁止拉伸
  disabledResize?: boolean
  // 禁止拖动
  disabledDrag?: boolean
  // 最小宽度
  minWidth?: number
  // 最小高度
  minHeight?: number
  // 最大宽度
  maxWidth?: number
  // 最大高度
  maxHeight?: number
  // 宽高比
  ratio?: number
  // 限位元素
  parent?: HTMLElement
  // 允许拉伸到父元素外面
  allowOverParent?: boolean
  // 保持置顶
  onTop?: boolean
}
