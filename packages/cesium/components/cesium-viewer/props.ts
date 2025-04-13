import type { Viewer } from 'cesium'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export type _ViewerOptions = ConstructorParameters<typeof Viewer>[1]

export type ViewerOptions = _ViewerOptions & {

}

export interface CesiumViewerProps {
  viewerOptions?: ViewerOptions
}

export const cesiumViewerInjectionKey = Symbol('cesiumViewerInjectionKey') as InjectionKey<Viewer>

export function useCeiusmViewer() {
  return inject(cesiumViewerInjectionKey)
}
