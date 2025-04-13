import type { Map as OLMap } from 'ol'
import type { MaybeRef, Ref } from 'vue'
import type { StrokeOptions, TextOptions } from '../../utils'
import { Graticule } from 'ol/layer'
import { Stroke } from 'ol/style'
import { ref, toValue, watch } from 'vue'
import { createTextStyle } from '../../utils'

export type _GraticuleOptions = ConstructorParameters<typeof Graticule>[0]

export type GraticuleOptions = _GraticuleOptions & {
  strokeStyleOption?: StrokeOptions
  labelStyleOption?: TextOptions
  latLabelStyleOption?: TextOptions
  lonLabelStyleOption?: TextOptions
}

export interface UseGraticuleOptions {
  olMap: MaybeRef<OLMap | null | undefined>
  graticuleOptions?: GraticuleOptions
  defaultShow?: boolean
}

export function useGraticule(options: UseGraticuleOptions) {
  const showGraticule: Ref<boolean> = ref(options.defaultShow || false)
  const { strokeStyleOption, strokeStyle, labelStyleOption, latLabelStyleOption, lonLabelStyleOption, latLabelStyle, lonLabelStyle, ...graticuleOptions } = options.graticuleOptions || {}
  const style = strokeStyleOption ? new Stroke(strokeStyleOption) : strokeStyle

  const labelText = labelStyleOption ? createTextStyle(labelStyleOption) : undefined

  const latLabelText = (latLabelStyleOption ? createTextStyle(latLabelStyleOption) : latLabelStyle) || labelText

  const lonLabelText = (lonLabelStyleOption ? createTextStyle(lonLabelStyleOption) : lonLabelStyle) || labelText

  const graticule = new Graticule({
    ...graticuleOptions,
    strokeStyle: style,
    latLabelStyle: latLabelText,
    lonLabelStyle: lonLabelText,
  }) as Graticule

  watch(
    showGraticule,
    (enable) => {
      graticule.setMap(null)
      if (enable) {
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
