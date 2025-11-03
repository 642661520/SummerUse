import type { LayerProps, UseLayerOptions } from '@/components/layer/props'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export type _LayerOptions = LayerProps & {
  readonly key: string
  readonly destroy: () => void
}

export type LayerReactive = {
  readonly key: string
  readonly destroy: () => void
} & _LayerOptions

export interface LayerApi {
  destroyAll: () => void
  create: (options: UseLayerOptions) => LayerReactive
}

export const layerProviderInjectionKey = Symbol('layerProviderInjectionKey') as InjectionKey<LayerApi>

export function injectLayer() {
  const layerProviderInjection = inject(layerProviderInjectionKey)
  if (!layerProviderInjection) {
    throw new Error('injectLayer must be used in LayerProvider')
  }
  return layerProviderInjection
}
