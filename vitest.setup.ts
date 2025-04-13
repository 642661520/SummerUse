import { beforeAll } from 'vitest'

beforeAll(() => {
  // 模拟 ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
