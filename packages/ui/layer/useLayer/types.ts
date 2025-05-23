import type { MaybeRefOrGetter } from 'vue'

export type ResizeDirection = 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface Directions {
  'left'?: boolean
  'right'?: boolean
  'top'?: boolean
  'bottom'?: boolean
  'top-left'?: boolean
  'top-right'?: boolean
  'bottom-left'?: boolean
  'bottom-right'?: boolean
}

export interface Rect {
  height: number
  width: number
  x: number
  y: number
}

export interface LayerOptions {
  // 方向
  directions?: MaybeRefOrGetter<Directions | undefined>
  // 初始位置
  initRect?: MaybeRefOrGetter<Rect>
  // 拖动元素
  dragElement?: MaybeRefOrGetter<HTMLElement | undefined>
  // 禁止拉伸
  disabledResize?: MaybeRefOrGetter<boolean>
  // 禁止拖动
  disabledDrag?: MaybeRefOrGetter<boolean>
  // 最小宽度
  minWidth?: MaybeRefOrGetter<number | undefined>
  // 最小高度
  minHeight?: MaybeRefOrGetter<number | undefined>
  // 最大宽度
  maxWidth?: MaybeRefOrGetter<number | undefined>
  // 最大高度
  maxHeight?: MaybeRefOrGetter<number | undefined>
  // 宽高比
  ratio?: MaybeRefOrGetter<number | undefined>
  // 限位元素
  parent?: MaybeRefOrGetter<HTMLElement | undefined>
  // 允许拉伸到父元素外面
  allowOverParent?: MaybeRefOrGetter<boolean>
}
