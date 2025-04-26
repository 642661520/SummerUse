import type { ComputedRef, Ref } from 'vue'
import type { Rect } from './types'

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
  maxRight,
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
  maxRight: Ref<number>
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
  const _maxRight = maxRight.value
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
    _maxRight,
    _minY,
    _ratio,
    _minWidth,
    _maxWidth,
    _minHeight,
    _maxHeight,
  }
}

function _initResize({ isResize }:
{
  isResize: Ref<boolean>
}) {
  isResize.value = true
  document.body.classList.add('summer-use-un-select')

  const close = () => {
    isResize.value = false
    document.body.classList.remove('summer-use-un-select')
  }
  return {
    close,
  }
}

/** @Description: 左边拉伸 */
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
    maxRight: Ref<number>
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
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    let nextWidth = width - moveX
    let nextX = x + moveX
    let nextHeight = height
    let nextY = y

    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
      nextX = startLeft - nextWidth
    }
    if (nextX < _minX) {
      nextX = _minX
      nextWidth = width - (nextX - x)
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
      nextX = startLeft - nextWidth
    }
    if (_ratio) {
      nextHeight = nextWidth / _ratio
      nextY = y - (nextHeight - height) / 2
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
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/** @Description: 右边拉伸 */
export function resizeRight(
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
    maxRight: Ref<number>
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
    _maxRight,
    _maxBottom,
    _minY,
    _ratio,
    _minWidth,
    _maxWidth,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    let nextWidth = width + moveX
    let nextHeight = height
    let nextY = y

    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
    }
    if (nextWidth + x > _maxRight) {
      nextWidth = _maxRight - x
    }

    if (_ratio) {
      nextHeight = nextWidth / _ratio
      nextY = y - (nextHeight - height) / 2
      if (nextY < _minY) {
        nextY = _minY
        nextHeight = (y - nextY) * 2 + height
        nextWidth = nextHeight * _ratio
      }
      if ((nextY + nextHeight) > _maxBottom) {
        nextY = y - (_maxBottom - y - height)
        nextHeight = _maxBottom - nextY
        nextWidth = nextHeight * _ratio
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.y = nextY
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/** @Description: 上边拉伸 */
export function resizeTop(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startY,
    x,
    y,
    height,
    width,
    startLeft,
    startTop,
    _minX,
    _maxRight,
    _minY,
    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveY = e.clientY - startY
    let nextHeight = height - moveY
    let nextY = y + moveY
    let nextWidth = width
    let nextX = x
    if (nextHeight + nextY >= startTop) {
      nextHeight = Math.max(nextHeight, _minHeight)
      nextY = startTop - nextHeight
      nextY = Math.min(nextY, startTop)
    }
    if (nextY < _minY) {
      nextY = _minY
      nextHeight = startTop - nextY
    }
    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
      nextY = startTop - nextHeight
    }

    if (_ratio) {
      nextWidth = nextHeight * _ratio
      nextX = x - (nextWidth - width) / 2
      if (nextX < _minX) {
        nextX = _minX
        nextWidth = (startLeft - _minX - width) * 2 + width
        nextHeight = nextWidth / _ratio
        nextY = startTop - nextHeight
      }
      if (nextX + nextWidth > _maxRight) {
        nextWidth = (_maxRight - x - width) * 2 + width
        nextX = _maxRight - nextWidth
        nextHeight = nextWidth / _ratio
        nextY = startTop - nextHeight
      }
    }

    rect.value.height = nextHeight
    rect.value.y = nextY
    rect.value.width = nextWidth
    rect.value.x = nextX
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/** @Description: 下边拉伸 */
export function resizeBottom(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startY,
    x,
    y,
    height,
    width,
    startLeft,
    _minX,
    _maxBottom,
    _maxRight,
    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })
  const mouseMoveHandler = (e: MouseEvent) => {
    const moveY = e.clientY - startY
    let nextHeight = height + moveY
    let nextWidth = width
    let nextX = x

    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
    }
    if (nextHeight < _minHeight) {
      nextHeight = Math.max(nextHeight, _minHeight)
    }

    if (nextHeight + y >= _maxBottom) {
      nextHeight = _maxBottom - y
    }

    if (_ratio) {
      nextWidth = nextHeight * _ratio
      nextX = x - (nextWidth - width) / 2

      if (nextX < _minX) {
        nextX = _minX
        nextWidth = (startLeft - _minX - width) * 2 + width
        nextHeight = nextWidth / _ratio
      }
      if (nextX + nextWidth > _maxRight) {
        nextWidth = (_maxRight - x - width) * 2 + width
        nextX = _maxRight - nextWidth
        nextHeight = nextWidth / _ratio
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.x = nextX
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/* @Description: 左上角拉伸 */
export function resizeTopLeft(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startX,
    startY,
    x,
    y,
    height,
    width,
    startTop,
    startLeft,
    _maxWidth,
    _minWidth,
    _maxRight,
    _minX,
    _minY,
    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    let nextWidth = width - moveX
    let nextHeight = height - moveY
    let nextY = y + moveY
    let nextX = x + moveX
    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
      nextX = startLeft - nextWidth
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
      nextX = startLeft - nextWidth
    }
    if (nextHeight + nextY >= startTop) {
      nextHeight = Math.max(nextHeight, _minHeight)
      nextY = startTop - nextHeight
      nextY = Math.min(nextY, startTop)
    }
    if (nextY < _minY) {
      nextY = _minY
      nextHeight = startTop - nextY
    }
    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
      nextY = startTop - nextHeight
    }

    if (_ratio) {
      const _nextWidth = nextHeight * _ratio
      nextWidth = Math.max(_nextWidth, nextWidth)
      nextHeight = nextWidth / _ratio
      nextY = startTop - nextHeight
      nextX = startLeft - nextWidth

      if (nextWidth + x > _maxRight) {
        nextWidth = _maxRight - x
        nextHeight = nextWidth / _ratio
        nextY = startTop - nextHeight
      }

      if (nextY < _minY) {
        nextY = _minY
        nextHeight = startTop - nextY
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
      }

      if (nextX < _minX) {
        nextX = _minX
        nextWidth = (startLeft - _minX - width) + width
        nextHeight = nextWidth / _ratio
        nextY = startTop - nextHeight
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.x = nextX
    rect.value.y = nextY
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}
/** @Description: 右上角拉伸 */
export function resizeTopRight(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startX,
    startY,
    x,
    y,
    height,
    width,
    startTop,
    _maxWidth,
    _minWidth,
    _maxRight,
    _minY,
    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    let nextWidth = width + moveX
    let nextHeight = height - moveY
    let nextY = y + moveY

    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
    }
    if (nextWidth + x > _maxRight) {
      nextWidth = _maxRight - x
    }

    if (nextHeight + nextY >= startTop) {
      nextHeight = Math.max(nextHeight, _minHeight)
      nextY = startTop - nextHeight
      nextY = Math.min(nextY, startTop)
    }
    if (nextY < _minY) {
      nextY = _minY
      nextHeight = startTop - nextY
    }
    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
      nextY = startTop - nextHeight
    }

    if (_ratio) {
      const _nextWidth = nextHeight * _ratio
      nextWidth = Math.max(_nextWidth, nextWidth)
      nextHeight = nextWidth / _ratio
      nextY = startTop - nextHeight

      if (nextWidth + x > _maxRight) {
        nextWidth = _maxRight - x
        nextHeight = nextWidth / _ratio
        nextY = startTop - nextHeight
      }

      if (nextY < _minY) {
        nextY = _minY
        nextHeight = startTop - nextY
        nextWidth = nextHeight * _ratio
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.y = nextY
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/** @Description: 左下角拉伸 */
export function resizeBottomLeft(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startX,
    startY,
    x,
    y,
    height,
    width,
    startLeft,
    _maxWidth,
    _minWidth,
    _maxBottom,
    _minX,
    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    let nextWidth = width - moveX
    let nextHeight = height + moveY
    const nextY = y
    let nextX = x + moveX

    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
      nextX = startLeft - nextWidth
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
      nextX = startLeft - nextWidth
    }
    if (nextHeight < _minHeight) {
      nextHeight = _minHeight
    }

    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
    }

    if (nextHeight + y > _maxBottom) {
      nextHeight = _maxBottom - y
    }

    if (_ratio) {
      const _nextWidth = nextHeight * _ratio
      nextWidth = Math.max(_nextWidth, nextWidth)
      nextHeight = nextWidth / _ratio
      nextX = startLeft - nextWidth

      if (nextHeight + y > _maxBottom) {
        nextHeight = _maxBottom - y
        nextWidth = nextHeight * _ratio
        nextX = startLeft - nextWidth
      }

      if (nextX < _minX) {
        nextX = _minX
        nextWidth = (startLeft - _minX - width) + width
        nextHeight = nextWidth / _ratio
        nextX = startLeft - nextWidth
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.y = nextY
    rect.value.x = nextX
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

/** @Description: 右下角拉伸 */
export function resizeBottomRight(data:
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
  maxRight: Ref<number>
  ratio: ComputedRef<number | undefined>
  isResize: Ref<boolean>
}) {
  const {
    startX,
    startY,
    x,
    y,
    height,
    width,
    _maxRight,
    _maxWidth,
    _minWidth,
    _maxBottom,

    _ratio,
    _minHeight,
    _maxHeight,
  } = initMousedownData(data)

  const { isResize, rect } = data

  const { close } = _initResize({ isResize })

  const mouseMoveHandler = (e: MouseEvent) => {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    let nextWidth = width + moveX
    let nextHeight = height + moveY
    const nextY = y

    if (nextWidth > _maxWidth) {
      nextWidth = _maxWidth
    }
    if (nextWidth < _minWidth) {
      nextWidth = _minWidth
    }
    if (nextHeight < _minHeight) {
      nextHeight = _minHeight
    }

    if (nextHeight > _maxHeight) {
      nextHeight = Math.min(nextHeight, _maxHeight)
    }

    if (nextHeight + y > _maxBottom) {
      nextHeight = _maxBottom - y
    }

    if (nextWidth + x > _maxRight) {
      nextWidth = _maxRight - x
    }

    if (_ratio) {
      const _nextWidth = nextHeight * _ratio
      nextWidth = Math.max(_nextWidth, nextWidth)
      nextHeight = nextWidth / _ratio

      if (nextHeight + y > _maxBottom) {
        nextHeight = _maxBottom - y
        nextWidth = nextHeight * _ratio
      }
      if (nextWidth + x > _maxRight) {
        nextWidth = _maxRight - x
        nextHeight = nextWidth / _ratio
      }
    }

    rect.value.height = nextHeight
    rect.value.width = nextWidth
    rect.value.y = nextY
  }
  const mouseUpHandler = () => {
    close()
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}
