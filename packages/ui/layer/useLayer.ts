import type { InjectionKey } from 'vue'
import type { LayerProps, UseLayerOptions } from './props'
import { inject } from 'vue'

export type LayerOptions = LayerProps & {
  readonly key: string
  readonly destroy: () => void
}

export type LayerReactive = {
  readonly key: string
  readonly destroy: () => void
} & LayerOptions

export interface DialogApiInjection {
  destroyAll: () => void
  create: (options: UseLayerOptions) => LayerReactive
}

export const layerProviderInjectionKey = Symbol('layerProviderInjectionKey') as InjectionKey<DialogApiInjection>

export function useLayer() {
  const layerProviderInjection = inject(layerProviderInjectionKey)
  if (!layerProviderInjection) {
    throw new Error('useLayer must be used in LayerProvider')
  }
  return layerProviderInjection
}
