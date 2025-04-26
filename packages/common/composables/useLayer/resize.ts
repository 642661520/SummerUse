import type { ComputedRef, Ref } from 'vue'
import type { ExternalWidth, Rect } from './types'

function initMousedownData({
  e,
  rect,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  minX,
  minY,
  maxBottom,
  ratio,
}:
{
  e: MouseEvent
  rect: Ref<Rect>
  minWidth: Ref<number>
  minHeight: Ref<number>
  maxWidth: Ref<number>
  maxHeight: Ref<number>
  minX: Ref<number>
  minY: Ref<number>
  maxBottom: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const startX = e.clientX
  const startY = e.clientY
  const x = rect.value.x
  const y = rect.value.y
  const height = rect.value.height
  const width = rect.value.width
  const startLeft = x + width
  const startTop = y + height
  const _minX = minX.value
  const _maxBottom = maxBottom.value
  const _minY = minY.value
  const _ratio = ratio.value
  const _minWidth = _ratio ? Math.max(minWidth.value, minHeight.value * _ratio) : minWidth.value
  const _maxWidth = _ratio ? Math.min(maxWidth.value, maxHeight.value * _ratio) : maxWidth.value
  const _minHeight = _ratio ? Math.max(minHeight.value, minWidth.value / _ratio) : minHeight.value
  const _maxHeight = _ratio ? Math.min(maxHeight.value, maxWidth.value / _ratio) : maxHeight.value

  return {
    startX,
    startY,
    x,
    y,
    height,
    width,
    startLeft,
    startTop,
    _minX,
    _maxBottom,
    _minY,
    _ratio,
    _minWidth,
    _maxWidth,
    _minHeight,
    _maxHeight,
  }
}

/**
 * @Description: 左边拉伸
 */
export function resizeLeft(
  data:
  {
    e: MouseEvent
    rect: Ref<Rect>
    minWidth: Ref<number>
    minHeight: Ref<number>
    maxWidth: Ref<number>
    maxHeight: Ref<number>
    minX: Ref<number>
    minY: Ref<number>
    maxBottom: Ref<number>
    ratio: ComputedRef<number | undefined>
    isResize: Ref<boolean>
  },
) {
  const {
    startX,
    x,
    y,
    height,
    width,
    startLeft,
    _minX,
    _maxBottom,
    _minY,
    _ratio,
    _minWidth,
    _maxWidth,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  isResize.value = true
  document.body.classList.add('summer-use-un-select')

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    let nextWidth = width - moveX
    let nextX = x + moveX
    let nextHeight = height
    let nextY = y

    if (nextWidth > _maxWidth) {
      nextWidth = Math.min(nextWidth, _maxWidth)
      nextX = Math.max(startLeft - nextWidth, startLeft)
    }
    if (nextX < _minX) {
      nextX = _minX
      nextWidth = width - (nextX - x)
    }
    if (nextWidth + nextX >= startLeft) {
      nextWidth = Math.max(nextWidth, _minWidth)
      nextX = Math.min(startLeft - nextWidth, startLeft)
    }
    if (_ratio) {
      nextHeight = nextWidth / _ratio
      nextY = y - (nextHeight - height) / 2
      if (nextHeight < _minHeight) {
        nextHeight = _minHeight
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
        nextY = y - (nextHeight - height) / 2
      }
      if (nextHeight > _maxHeight) {
        nextHeight = Math.min(nextHeight, _maxHeight)
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
        nextY = y - (nextHeight - height) / 2
      }

      if (nextY < _minY) {
        nextY = _minY
        nextHeight = (y - nextY) * 2 + height
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
      }
      if ((nextY + nextHeight) > _maxBottom) {
        nextY = y - (_maxBottom - y - height)
        nextHeight = _maxBottom - nextY
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.x = nextX
    rect.value.y = nextY
  }
  const mouseUpHandler = () => {
    isResize.value = false
    document.body.classList.remove('summer-use-un-select')
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 上边拉伸
 */
export function resizeTop({ e, rect, resizeElement, externalWidth, minHeight }: {
  e: MouseEvent
  resizeElement: HTMLDivElement
  rect: Rect
  externalWidth: ExternalWidth
  minHeight: number
  ratio?: number
}) {
  const startY = e.clientY
  const startHeight = resizeElement.offsetHeight
  const y = rect.y
  const startTop = y + startHeight - externalWidth.value[0]
  const _minHeight = externalWidth.value[0] + externalWidth.value[2] + minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveY = e.clientY - startY
    const nextHeight = startHeight - moveY
    const nextY = y + moveY
    if (nextHeight + nextY >= startTop) {
      rect.height = Math.max(nextHeight, _minHeight)
      const nextY = startTop - rect.height
      rect.y = Math.min(nextY, startTop)
    }
    else {
      rect.height = nextHeight
      rect.y = nextY
    }
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 下边拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeBottom(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minHeight: number) {
  const startY = e.clientY
  const startHeight = resizeElement.offsetHeight
  const _minHeight = externalWidth.value[0] + externalWidth.value[2] + minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveY = e.clientY - startY
    const height = startHeight + moveY
    rect.height = Math.max(height, _minHeight)
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 左上角拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeTopLeft(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minArea: {
  minWidth: number
  minHeight: number
}) {
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = resizeElement.offsetWidth
  const startHeight = resizeElement.offsetHeight
  const x = rect.x
  const y = rect.y
  const startLeft = x + startWidth - externalWidth.value[3]
  const startTop = y + startHeight - externalWidth.value[0]
  const minWidth = externalWidth.value[3] + externalWidth.value[1] + minArea.minWidth
  const minHeight = externalWidth.value[0] + externalWidth.value[2] + minArea.minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    const nextWidth = startWidth - moveX
    const nextHeight = startHeight - moveY
    const nextX = x + moveX
    const nextY = y + moveY
    if (nextWidth + nextX >= startLeft) {
      rect.width = Math.max(nextWidth, minWidth)
      const nextX = startLeft - rect.width
      rect.x = Math.min(nextX, startLeft)
    }
    else {
      rect.width = nextWidth
      rect.x = nextX
    }
    if (nextHeight + nextY >= startTop) {
      rect.height = Math.max(nextHeight, minHeight)
      const nextY = startTop - rect.height
      rect.y = Math.min(nextY, startTop)
    }
    else {
      rect.height = nextHeight
      rect.y = nextY
    }
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 右上角拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeTopRight(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minArea: {
  minWidth: number
  minHeight: number
}) {
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = resizeElement.offsetWidth
  const startHeight = resizeElement.offsetHeight
  const x = rect.x
  const y = rect.y
  const startRight = x + externalWidth.value[1]
  const startTop = y + startHeight - externalWidth.value[0]
  const minWidth = externalWidth.value[3] + externalWidth.value[1] + minArea.minWidth
  const minHeight = externalWidth.value[0] + externalWidth.value[2] + minArea.minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    const nextWidth = startWidth + moveX
    const nextHeight = startHeight - moveY
    const nextY = y + moveY
    rect.width
      = nextWidth + x >= startRight ? Math.max(nextWidth, minWidth) : nextWidth
    if (nextHeight + nextY >= startTop) {
      rect.height = Math.max(nextHeight, minHeight)
      const nextY = startTop - rect.height
      rect.y = Math.min(nextY, startTop)
    }
    else {
      rect.height = nextHeight
      rect.y = nextY
    }
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 左下角拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeBottomLeft(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minArea: {
  minWidth: number
  minHeight: number
}) {
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = resizeElement.offsetWidth
  const startHeight = resizeElement.offsetHeight
  const x = rect.x
  const y = rect.y
  const startLeft = x + startWidth - externalWidth.value[3]
  const startBottom = y + externalWidth.value[2]
  const minWidth = externalWidth.value[3] + externalWidth.value[1] + minArea.minWidth
  const minHeight = externalWidth.value[0] + externalWidth.value[2] + minArea.minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    const nextWidth = startWidth - moveX
    const nextHeight = startHeight + moveY
    const nextX = x + moveX
    if (nextWidth + nextX >= startLeft) {
      rect.width = Math.max(nextWidth, minWidth)
      const nextX = startLeft - rect.width
      rect.x = Math.min(nextX, startLeft)
    }
    else {
      rect.width = nextWidth
      rect.x = nextX
    }
    rect.height
      = nextHeight + y >= startBottom
        ? Math.max(nextHeight, minHeight)
        : nextHeight
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 右下角拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeBottomRight(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minArea: {
  minWidth: number
  minHeight: number
}) {
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = resizeElement.offsetWidth
  const startHeight = resizeElement.offsetHeight
  const x = rect.x
  const y = rect.y
  const startRight = x + externalWidth.value[1]
  const startBottom = y + externalWidth.value[2]
  const minWidth = externalWidth.value[3] + externalWidth.value[1] + minArea.minWidth
  const minHeight = externalWidth.value[0] + externalWidth.value[2] + minArea.minHeight
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    const nextWidth = startWidth + moveX
    const nextHeight = startHeight + moveY
    rect.width
      = nextWidth + x >= startRight ? Math.max(nextWidth, minWidth) : nextWidth
    rect.height
      = nextHeight + y >= startBottom
        ? Math.max(nextHeight, minHeight)
        : nextHeight
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/**
 * @Description: 右边拉伸
 * @param {MouseEvent} e
 * @param {HTMLDivElement} resizeElement 拉伸元素
 * @param {Rect} rect
 * @param {ExternalWidth} externalWidth 外部宽度
 */
export function resizeRight(e: MouseEvent, resizeElement: HTMLDivElement, rect: Rect, externalWidth: ExternalWidth, minWidth: number) {
  const startX = e.clientX
  const startWidth = resizeElement.offsetWidth
  const x = rect.x
  const startRight = x + externalWidth.value[1]
  const _minWidth = externalWidth.value[3] + externalWidth.value[1] + minWidth
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const nextWidth = startWidth + moveX
    rect.width
      = nextWidth + x >= startRight ? Math.max(nextWidth, _minWidth) : nextWidth
  }
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}
