import type { CreateLayerOptions, LayerProps } from '@/components/layer/props'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface LayerReactive {
  readonly key: string
  readonly destroy: () => void
  readonly hide: () => void
  readonly open: () => void
}

export type _LayerOptions = LayerProps & LayerReactive & {
  isDestroyed: boolean
}

export interface LayerApi {
  destroyAll: () => void
  create: (options: CreateLayerOptions) => LayerReactive
  hideAll: () => void
}

export const layerProviderInjectionKey = Symbol('layerProviderInjectionKey') as InjectionKey<LayerApi>

export function injectLayer() {
  const layerProviderInjection = inject(layerProviderInjectionKey)
  if (!layerProviderInjection) {
    throw new Error('injectLayer must be used in LayerProvider')
  }
  return layerProviderInjection
}
