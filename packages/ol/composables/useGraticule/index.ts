import type { Map as OLMap } from 'ol'
import type { MaybeRef, Ref } from 'vue'
import type { StrokeOptions } from '../../utils'
import { Graticule } from 'ol/layer'
import { Stroke } from 'ol/style'
import { ref, toValue, watch } from 'vue'

export type _GraticuleOptions = ConstructorParameters<typeof Graticule>[0]

export type GraticuleOptions = _GraticuleOptions & {
  strokeStyleOption?: StrokeOptions
}

export interface UseGraticuleOptions {
  olMap: MaybeRef<OLMap | null | undefined>
  graticuleOptions?: GraticuleOptions
  defaultShow?: boolean
}

export function useGraticule(options: UseGraticuleOptions) {
  const showGraticule: Ref<boolean> = ref(options.defaultShow || false)
  const { strokeStyleOption, strokeStyle, ...graticuleOptions } = options.graticuleOptions || {}
  const style = strokeStyleOption ? new Stroke(strokeStyleOption) : strokeStyle
  let graticule = new Graticule({
    ...graticuleOptions,
    strokeStyle: style,
  }) as Graticule

  watch(
    showGraticule,
    (enable) => {
      graticule.setMap(null)
      if (enable) {
        graticule = new Graticule({
          strokeStyle: new Stroke({
            color: '#555',
            width: 1.5,
            lineDash: [4, 4],
          }),
          showLabels: true,
          wrapX: false,
          zIndex: 1,
        })
        const olMap = toValue(options.olMap)
        if (olMap) {
          graticule.setMap(olMap)
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  )

  return {
    showGraticule,
  }
}

export type UseGraticuleReturn = ReturnType<typeof useGraticule>
