import type { MaybeRefOrGetter } from 'vue'

import type {
  Directions,
  LayerOptions,
  ResizeDirection,
} from './types'

import {
  tryOnScopeDispose,
  unrefElement,
  useEventListener,
  useResizeObserver,
} from '@vueuse/core'

import { computed, ref, toValue, watch, watchEffect } from 'vue'

import { drag } from './drag'

import {
  resizeBottom,
  resizeBottomLeft,
  resizeBottomRight,
  resizeLeft,
  resizeRight,
  resizeTop,
  resizeTopLeft,
  resizeTopRight,
} from './resize'
import './index.scss'

const defaultOptions = {
  initRect: {
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  },
}

const defaultDirections: Directions = {
  'left': true,
  'right': true,
  'top': true,
  'bottom': true,
  'top-left': true,
  'top-right': true,
  'bottom-left': true,
  'bottom-right': true,
}

function createResizeElement() {
  const resizeElement = document.createElement('div')
  resizeElement.classList.add('summer-use-resize')
  const resizeElementChildren: {
    [key in ResizeDirection]: HTMLElement
  } = {} as any
  // 遍历options，创建resize元素
  for (const key in defaultDirections) {
    if (Object.prototype.hasOwnProperty.call(defaultDirections, key)) {
      const element = defaultDirections[key as keyof Directions]
      if (element) {
        const resizeElementChild = document.createElement('div')
        resizeElementChild.classList.add(`summer-use-resize-${key}`)
        resizeElementChildren[key as ResizeDirection] = resizeElementChild
        resizeElement.append(resizeElementChild)
      }
    }
  }
  return {
    resizeElement,
    resizeElementChildren,
  }
}

function getParentRect(el: Element) {
  const rect = el.getBoundingClientRect()
  // 获取页面的宽高
  const { innerHeight, innerWidth } = window
  return {
    width: Math.min(innerWidth, rect.width),
    height: Math.min(innerHeight, rect.height),
    left: Math.max(0, rect.left),
    top: Math.max(0, rect.top),
  }
}

export function useLayer(target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>, options?: LayerOptions) {
  const rect = ref((toValue(options?.initRect) || defaultOptions.initRect))
  const { resizeElement, resizeElementChildren } = createResizeElement()
  const _parentRect = ref((getParentRect(unrefElement(options?.parent) || document.body)))

  const isResize = ref(false)

  const dragElement = computed(() => {
    return unrefElement(options?.dragElement) || unrefElement(target)
  })

  const parent = computed(() => {
    return unrefElement(options?.parent) || document.body
  })

  const allowOverParent = computed(() => {
    return toValue(options?.allowOverParent) || false
  })

  const parentRect = computed(() => {
    return allowOverParent.value
      ? {
          width: window.screen.width * 3,
          height: window.screen.height * 3,
          top: -window.screen.height,
          left: -window.screen.width,
        }
      : _parentRect.value
  })

  const initRect = computed(() => {
    return toValue(options?.initRect)
  })

  const disabledResize = computed(() => {
    return toValue(options?.disabledResize || false)
  })

  const disabledDrag = computed(() => {
    return isResize.value || toValue(options?.disabledDrag || false)
  })

  const minWidth = computed(() => {
    return (toValue(options?.minWidth) || 0)
  })

  const minHeight = computed(() => {
    return (toValue(options?.minHeight) || 0)
  })

  const maxWidth = computed(() => {
    const _maxWidth = (toValue(options?.maxWidth) || parentRect.value.width)
    return Math.min(_maxWidth, parentRect.value.width)
  })

  const maxHeight = computed(() => {
    const _maxHeight = (toValue(options?.maxHeight) || parentRect.value.height)
    return Math.min(_maxHeight, parentRect.value.height)
  })
  // 左边界
  const minX = computed(() => {
    return parentRect.value.left
  })
  // 上边界
  const minY = computed(() => {
    return parentRect.value.top
  })
  // 下边界
  const maxBottom = computed(() => {
    return minY.value + parentRect.value.height
  })
  // 右边界
  const maxRight = computed(() => {
    return minX.value + parentRect.value.width
  })

  const directions = computed(() => {
    return toValue(options?.directions) || defaultDirections
  })

  const ratio = computed(() => {
    return toValue(options?.ratio) || undefined
  })

  const check = () => {
    const _minX = minX.value
    const _minY = minY.value
    const _maxBottom = maxBottom.value
    const _maxRight = maxRight.value
    const _ratio = ratio.value
    const _minWidth = _ratio ? Math.max(minWidth.value, minHeight.value * _ratio) : minWidth.value
    const _maxWidth = _ratio ? Math.min(maxWidth.value, maxHeight.value * _ratio) : maxWidth.value
    const _minHeight = _ratio ? Math.max(minHeight.value, minWidth.value / _ratio) : minHeight.value
    const _maxHeight = _ratio ? Math.min(maxHeight.value, maxWidth.value / _ratio) : maxHeight.value

    if (rect.value.width < _minWidth) {
      rect.value.width = _minWidth
      if (_ratio) {
        rect.value.height = _minHeight
      }
    }
    if (rect.value.height < _minHeight) {
      rect.value.height = _minHeight
      if (_ratio) {
        rect.value.width = _minWidth
      }
    }
    if (rect.value.width > _maxWidth) {
      rect.value.width = _maxWidth
      if (_ratio) {
        rect.value.height = _maxHeight
      }
    }
    if (rect.value.height > _maxHeight) {
      rect.value.height = _maxHeight
      if (_ratio) {
        rect.value.width = _maxWidth
      }
    }
    if (rect.value.x < _minX) {
      rect.value.x = _minX
    }
    if (rect.value.y < _minY) {
      rect.value.y = _minY
    }
    if (rect.value.x + rect.value.width > _maxRight) {
      rect.value.x = _maxRight - rect.value.width
    }
    if (rect.value.y + rect.value.height > _maxBottom) {
      rect.value.y = _maxBottom - rect.value.height
    }
  }

  check()

  useEventListener(dragElement, 'mousedown', (e: MouseEvent) => {
    if (disabledDrag.value)
      return
    drag({
      e,
      rect,
      maxBottom,
      maxRight,
      minX,
      minY,
    })
  })

  const LeftElement = resizeElementChildren.left
  useEventListener(LeftElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.left === false)
      return
    resizeLeft({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const RightElement = resizeElementChildren.right
  useEventListener(RightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.right === false)
      return
    resizeRight({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const TopElement = resizeElementChildren.top
  useEventListener(TopElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.top === false)
      return
    resizeTop({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const BottomElement = resizeElementChildren.bottom
  useEventListener(BottomElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.bottom === false)
      return
    resizeBottom({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const TopLeftElement = resizeElementChildren['top-left']
  useEventListener(TopLeftElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['top-left'] === false)
      return
    resizeTopLeft({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const TopRightElement = resizeElementChildren['top-right']
  useEventListener(TopRightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['top-right'] === false)
      return
    resizeTopRight({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const BottomLeftElement = resizeElementChildren['bottom-left']
  useEventListener(BottomLeftElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['bottom-left'] === false)
      return
    resizeBottomLeft({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })
  const BottomRightElement = resizeElementChildren['bottom-right']
  useEventListener(BottomRightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['bottom-right'] === false)
      return
    resizeBottomRight({
      e,
      rect,
      minWidth,
      minHeight,
      ratio,
      maxWidth,
      maxHeight,
      minX,
      minY,
      maxBottom,
      maxRight,
      isResize,
    })
  })

  const close = () => {
    const el = unrefElement(target)
    if (resizeElement && el) {
      el.removeChild(resizeElement)
    }
  }

  const stopRect = watch(
    initRect,
    (initRect) => {
      if (initRect) {
        rect.value = initRect
      }
    },
  )

  const stopElement = watch(
    () => unrefElement(target),
    (el) => {
      if (!el)
        return
      if (el.lastChild === resizeElement)
        return
      el.append(resizeElement)
    },
  )

  watch(dragElement, (dragElement, oldDragElement) => {
    oldDragElement?.classList.remove('summer-use-drag')
    if (!disabledDrag.value) {
      dragElement?.classList.add('summer-use-drag')
    }
  }, {
    immediate: true,
  })

  watch(disabledDrag, (disabledDrag) => {
    if (disabledDrag) {
      dragElement.value?.classList.remove('summer-use-drag')
    }
    else {
      dragElement.value?.classList.add('summer-use-drag')
    }
  }, {
    immediate: true,
  })

  watchEffect(() => {
    const directionList = Object.entries(directions.value)
    const disabledDirection = directionList
      .filter(([_, status]) => {
        return !status
      })
      .map(([key]) => {
        return `.summer-use-resize-${key}`
      })
    const openDirection = directionList
      .filter(([_, status]) => {
        return status
      })
      .map(([key]) => {
        return `.summer-use-resize-${key}`
      })
    openDirection.forEach((key) => {
      resizeElement.querySelector(key)?.classList.remove('summer-use-resize-direction-disabled')
    })

    disabledDirection.forEach((key) => {
      resizeElement.querySelector(key)?.classList.add('summer-use-resize-direction-disabled')
    })
  })

  watchEffect(() => {
    if (disabledResize.value) {
      resizeElement.classList.add('summer-use-resize-disabled')
    }
    else {
      resizeElement.classList.remove('summer-use-resize-disabled')
    }
  })

  const parentResizeObserver = useResizeObserver(parent, (entries) => {
    if (!entries[0])
      return
    _parentRect.value = getParentRect(entries[0].target)
  })

  tryOnScopeDispose(() => {
    parentResizeObserver.stop()
    stopElement()
    stopRect()
    close()
  })

  return {
    rect,
    check,
  }
}
