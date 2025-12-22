import type { Ref } from 'vue'
import type { Rect } from './types'

export function drag(
  { e, rect, minX, maxRight, minY, maxBottom, isDrag }: {
    e: MouseEvent
    rect: Ref<Rect>
    minX: Ref<number>
    maxRight: Ref<number>
    minY: Ref<number>
    maxBottom: Ref<number>
    isDrag: Ref<boolean>
  },
) {
  const startX = e.clientX
  const startY = e.clientY
  const startLeft = rect.value.x
  const startTop = rect.value.y
  const width = rect.value.width
  const height = rect.value.height

  document.body.classList.add('summer-use-un-select')
  const mouseMoveHandler = (e: MouseEvent) => {
    isDrag.value = true
    let x = e.clientX - startX + startLeft
    let y = e.clientY - startY + startTop
    if (x < minX.value) {
      x = minX.value
    }
    if (x > maxRight.value - width) {
      x = maxRight.value - width
    }
    if (y < minY.value) {
      y = minY.value
    }
    if (y > maxBottom.value - height) {
      y = maxBottom.value - height
    }
    rect.value.x = x
    rect.value.y = y
  }

  const mouseUpHandler = () => {
    isDrag.value = false
    document.body.classList.remove('summer-use-un-select')
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}
