import type { Coordinate } from 'ol/coordinate'
import type { Style } from 'ol/style'
import type { VNode } from 'vue'
import type { OLMap } from '../../types'
import type { StyleOptions } from '../../utils'
import { Feature, Overlay } from 'ol'
import { LineString } from 'ol/geom'
import { Draw, Modify } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { computed, onMounted, onUnmounted, ref, render } from 'vue'
import { createStyle } from '../../utils'
import { getExtentCenter } from '../../utils/calculate'
import { mercatorExtentToWgs84, wgs84ToMercator } from '../../utils/projection'
import { createToolTipElement } from '../common'

export interface DrawLineStringOptions {
  defaultCoordinates?: Coordinate[][] // 默认线条坐标
  deletePointLabel?: VNode // 删除点的标签
  deleteFeatureLabel?: VNode // 删除线的标签
  style?: Style // 线条样式
  styleOptions?: StyleOptions
  drawStyle?: Style // 绘制时的样式
  drawStyleOptions?: StyleOptions
  modifyStyle?: Style // 修改时的样式
  modifyStyleOptions?: StyleOptions
  zIndex?: number // 图层z-index
  size?: number // 最大线条数量
}

export function useDrawLineString(olMap: OLMap, options: DrawLineStringOptions) {
  const inDraw = ref(true)

  const features = ref<Feature<LineString>[]>([])

  const coordinates = computed(() => {
    return features.value.map((feature) => {
      return feature.getGeometry()!.getCoordinates()
    })
  })

  const source = new VectorSource() // 创建一个矢量图层
  const style = options.styleOptions ? createStyle(options.styleOptions) : options?.style
  const layer = new VectorLayer({
    source,
    style,
    zIndex: options?.zIndex,
  })
  olMap.addLayer(layer)
  const drawStyle = options.drawStyleOptions ? createStyle(options.drawStyleOptions) : options?.drawStyle
  const draw = new Draw({
    source,
    style: drawStyle || style,
    type: 'LineString',
  })
  draw.setActive(false) // 默认不激活
  const modifyStyle = options.modifyStyleOptions ? createStyle(options.modifyStyleOptions) : options?.modifyStyle
  const modify = new Modify({
    source,
    style: modifyStyle || style,
  })
  const overlaySet = new Set<Overlay>()
  olMap.addInteraction(draw)
  onMounted(() => {
    olMap.addInteraction(modify)
  })

  source.on('addfeature', () => {
    if (options.size) {
      if (source.getFeatures().length >= options.size) {
        draw.setActive(false)
      }
    }
  })
  source.on('removefeature', () => {
    if (options.size) {
      if (source.getFeatures().length < options.size) {
        draw.setActive(true)
      }
    }
  })

  const clearOverlay = () => {
    overlaySet.forEach((overlay) => {
      olMap.removeOverlay(overlay)
    })
    overlaySet.clear()
  }

  source.on('change', () => {
    clearOverlay()
    source.getFeatures().forEach((feature) => {
      const geometry = feature.getGeometry() as LineString
      const center = getExtentCenter(mercatorExtentToWgs84(geometry.getExtent()))
      let element = document.createElement('div')
      if (options.deleteFeatureLabel) {
        render(options.deleteFeatureLabel, element)
      }
      else {
        element = createToolTipElement('删除线')
      }
      element.addEventListener('click', () => {
        source.removeFeature(feature)
      })
      const overlay = new Overlay({
        position: wgs84ToMercator(center),
        positioning: 'center-center',
        element,
      })
      overlaySet.add(overlay)
      olMap.addOverlay(overlay)

      const coordinates = geometry.getCoordinates()
      if (coordinates.length < 3)
        return
      coordinates.forEach((coordinate, index) => {
        let element = document.createElement('div')
        if (options.deletePointLabel) {
          render(options.deletePointLabel, element)
        }
        else {
          element = createToolTipElement('删除点')
        }
        element.addEventListener('click', () => {
          feature.setGeometry(new LineString(coordinates.filter((_, i) => i !== index)))
        })
        const overlay = new Overlay({
          position: coordinate,
          positioning: 'top-center',
          offset: [0, -30],
          element,
        })
        overlaySet.add(overlay)
        olMap.addOverlay(overlay)
      })
    })
  })

  draw.on('change:active', () => {
    inDraw.value = draw.getActive()
  })

  source.on('change', () => {
    features.value = source.getFeatures() as Feature<LineString>[]
  })

  /** 销毁 */
  const destroy = () => {
    clearOverlay()
    olMap.removeLayer(layer)
    olMap.removeInteraction(draw)
    olMap.removeInteraction(modify)
  }

  const start = () => {
    if (options.size && features.value.length >= options.size)
      return
    draw.setActive(true)
  }

  const stop = () => {
    draw.setActive(false)
  }

  /** 重新设置坐标 */
  const setFeatures = (coordinates: Coordinate[][]) => {
    source.clear()
    coordinates.forEach((coordinate) => {
      if (coordinate.length < 2)
        return
      const feature = new Feature({
        geometry: new LineString(coordinate),
      })
      source.addFeature(feature)
    })
  }

  /** 恢复到默认 */
  const reset = () => {
    setFeatures(options.defaultCoordinates || [])
  }

  reset() // 初始化

  /** 停止绘制并清空 */
  const clear = () => {
    source.clear()
    stop()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    inDraw,
    start,
    stop,
    clear,
    setFeatures,
    reset,
    features,
    coordinates,
    destroy,
  }
}
