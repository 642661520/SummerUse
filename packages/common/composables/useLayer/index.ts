import type { MaybeRefOrGetter } from 'vue'

import type {
  Directions,
  ExternalWidth,
  LayerOptions,
  OutRect,
  Rect,
  ResizeDirection,
} from './types'

import {
  tryOnScopeDispose,
  unrefElement,
  useEventListener,
  useResizeObserver,
  useWindowSize,
} from '@vueuse/core'

import { computed, ref, toValue, watch } from 'vue'

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

function RectToOutRect(rect: Rect): OutRect {
  const { width, height, x, y } = rect
  return {
    width: unitStringToNumber(width, 'x'),
    height: unitStringToNumber(height, 'y'),
    x: unitStringToNumber(x, 'x'),
    y: unitStringToNumber(y, 'y'),
  }
}

function unitStringToNumber(value: number | string, axis: 'x' | 'y') {
  const { width, height } = useWindowSize()
  if (typeof value === 'string') {
    const unit = value.replace(/\d/g, '') || 'px'
    switch (unit) {
      case '%': {
        return axis === 'x'
          ? (Number.parseFloat(value) * width.value) / 100
          : (Number.parseFloat(value) * height.value) / 100
      }
      case 'vh': {
        return (Number.parseFloat(value) * height.value) / 100
      }
      case 'vw': {
        return (Number.parseFloat(value) * width.value) / 100
      }
      default: {
        return Number.parseFloat(value)
      }
    }
  }
  return value
}

const defaultOptions = {
  initRect: {
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  },
  minArea: {
    width: 200,
    height: 200,
  },
  maxArea: {
    width: 200,
    height: 200,
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

export function useLayer(target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>, options?: LayerOptions) {
  const rect = ref(RectToOutRect(toValue(options?.initRect) || defaultOptions.initRect))
  const externalWidth: ExternalWidth = ref([0, 0, 0, 0])
  const { resizeElement, resizeElementChildren } = createResizeElement()
  const _parentRect = ref((unrefElement(options?.parent) || document.body).getBoundingClientRect())

  const isResize = ref(false)

  const dragElement = computed(() => {
    return unrefElement(options?.dragElement) || unrefElement(target)
  })

  const parent = computed(() => {
    return unrefElement(options?.parent) || document.body
  })

  const parentRect = computed(() => {
    return toValue(options?.allowOverParent)
      ? {
          width: window.screen.width * 2,
          height: window.screen.height * 2,
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
    return (toValue(options?.minWidth) || defaultOptions.minArea.width) + externalWidth.value[3] + externalWidth.value[1]
  })

  const minHeight = computed(() => {
    return (toValue(options?.minHeight) || defaultOptions.minArea.height) + externalWidth.value[0] + externalWidth.value[2]
  })

  const maxWidth = computed(() => {
    const _maxWidth = (toValue(options?.maxWidth) || defaultOptions.maxArea.width) + externalWidth.value[3] + externalWidth.value[1]
    return Math.min(_maxWidth, parentRect.value.width)
  })

  const maxHeight = computed(() => {
    const _maxHeight = (toValue(options?.maxHeight) || defaultOptions.maxArea.height) + externalWidth.value[0] + externalWidth.value[2]
    return Math.min(_maxHeight, parentRect.value.height)
  })
  // 左边界
  const minX = computed(() => {
    return parentRect.value.left + externalWidth.value[3] + externalWidth.value[1]
  })
  // 上边界
  const minY = computed(() => {
    return parentRect.value.top + externalWidth.value[0] + externalWidth.value[2]
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
      isResize,
    })
  })
  const RightElement = resizeElementChildren.right
  useEventListener(RightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.right === false)
      return
    resizeRight(e, resizeElement, rect.value, externalWidth, minWidth.value)
  })
  const TopElement = resizeElementChildren.top
  useEventListener(TopElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.top === false)
      return
    resizeTop({
      e,
      resizeElement,
      rect: rect.value,
      externalWidth,
      minHeight: minHeight.value,
    })
  })
  const BottomElement = resizeElementChildren.bottom
  useEventListener(BottomElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value.bottom === false)
      return
    resizeBottom(e, resizeElement, rect.value, externalWidth, minHeight.value)
  })
  const TopLeftElement = resizeElementChildren['top-left']
  useEventListener(TopLeftElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['top-left'] === false)
      return
    resizeTopLeft(e, resizeElement, rect.value, externalWidth, {
      minHeight: minHeight.value,
      minWidth: minWidth.value,
    })
  })
  const TopRightElement = resizeElementChildren['top-right']
  useEventListener(TopRightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['top-right'] === false)
      return
    resizeTopRight(e, resizeElement, rect.value, externalWidth, {
      minHeight: minHeight.value,
      minWidth: minWidth.value,
    })
  })
  const BottomLeftElement = resizeElementChildren['bottom-left']
  useEventListener(BottomLeftElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['bottom-left'] === false)
      return
    resizeBottomLeft(e, resizeElement, rect.value, externalWidth, {
      minHeight: minHeight.value,
      minWidth: minWidth.value,
    })
  })
  const BottomRightElement = resizeElementChildren['bottom-right']
  useEventListener(BottomRightElement, 'mousedown', (e: MouseEvent) => {
    if (disabledResize.value)
      return
    if (directions.value['bottom-right'] === false)
      return
    resizeBottomRight(e, resizeElement, rect.value, externalWidth, {
      minHeight: minHeight.value,
      minWidth: minWidth.value,
    })
  })

  const close = () => {
    const el = unrefElement(target)
    if (resizeElement && el) {
      el.removeChild(resizeElement)
    }
  }

  const stopExternalWidth = watch(
    () => externalWidth.value,
    ([top, right, bottom, left]) => {
      resizeElement.style.width = `calc(100% + ${left + right}px)`
      resizeElement.style.height = `calc(100% + ${top + bottom}px)`
      resizeElement.style.top = `-${top}px`
      resizeElement.style.left = `-${left}px`
    },
  )

  const stopRect = watch(
    initRect,
    (initRect) => {
      if (initRect) {
        rect.value = RectToOutRect(initRect)
      }
    },
  )

  const stopElement = watch(
    () => unrefElement(target),
    (el) => {
      if (!el)
        return
      el.append(resizeElement)
      stopElement()
    },
  )

  const externalWidthResizeObserver = useResizeObserver(target, (entries) => {
    if (!entries[0])
      return
    const {
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
      marginBottom,
      marginLeft,
      marginTop,
      marginRight,
    } = getComputedStyle(entries[0].target)
    externalWidth.value = [
      Number.parseFloat(borderTopWidth) + Number.parseFloat(marginTop),
      Number.parseFloat(borderRightWidth) + Number.parseFloat(marginRight),
      Number.parseFloat(borderBottomWidth) + Number.parseFloat(marginBottom),
      Number.parseFloat(borderLeftWidth) + Number.parseFloat(marginLeft),
    ]
  })

  const parentResizeObserver = useResizeObserver(parent, (entries) => {
    if (!entries[0])
      return
    const rect = entries[0].target.getBoundingClientRect()
    _parentRect.value = rect
  })

  tryOnScopeDispose(() => {
    externalWidthResizeObserver.stop()
    parentResizeObserver.stop()
    stopExternalWidth()
    stopRect()
    close()
  })

  return {
    rect,
    externalWidth,
  }
}
