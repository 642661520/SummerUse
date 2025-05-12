import type { InjectionKey } from 'vue'
import type { LayerProps, UseLayerOptions } from './props'
import { inject } from 'vue'

export type _LayerOptions = LayerProps & {
  readonly key: string
  readonly destroy: () => void
}

export type LayerReactive = {
  readonly key: string
  readonly destroy: () => void
} & _LayerOptions

export interface DialogApiInjection {
  destroyAll: () => void
  create: (options: UseLayerOptions) => LayerReactive
}

export const layerProviderInjectionKey = Symbol('layerProviderInjectionKey') as InjectionKey<DialogApiInjection>

export function injectLayer() {
  const layerProviderInjection = inject(layerProviderInjectionKey)
  if (!layerProviderInjection) {
    throw new Error('injectLayer must be used in LayerProvider')
  }
  return layerProviderInjection
}
