import VectorSource from 'ol/source/Vector';
import type { OLMap } from '../../types';
import VectorLayer from 'ol/layer/Vector';
import { Draw, Modify } from 'ol/interaction';
import type { Style } from 'ol/style';
import { Feature, Overlay } from 'ol';
import { LineString } from 'ol/geom';
import { computed, onUnmounted, ref, render, type VNode } from 'vue';
import { getExtentCenter } from '../calculate';
import { mercatorExtentToWgs84, wgs84ToMercator } from '../projection';
import type { Coordinate } from 'ol/coordinate';

export type DrawLineStringOptions = {
  defaultCoordinates?: Coordinate[][];
  deletePointLabel?: VNode;
  deleteFeatureLabel?: VNode;
  style?: Style;
  drawStyle?: Style;
  modifyStyle?: Style;
  zIndex?: number;
  size?: number;
  // 不允许编辑
  noEdit?: boolean;
  // 不允许删除
  noDelete?: boolean;
};

export const drawLineString = (map: OLMap, options: DrawLineStringOptions) => {
  const source = new VectorSource(); // 创建一个矢量图层
  const layer = new VectorLayer({
    source: source,
    style: options?.style,
    zIndex: options?.zIndex,
  });
  map.addLayer(layer);
  const draw = new Draw({
    source: source,
    style: options?.drawStyle || options?.style,
    type: 'LineString',
  });
  const modify = new Modify({
    source: source,
    style: options?.modifyStyle || options?.style,
  });
  map.addInteraction(draw);
  if (!options.noEdit) {
    // map.addInteraction(modify);
    setTimeout(() => {
      map.addInteraction(modify);
    });
  }

  source.on('addfeature', () => {
    if (options.size) {
      if (source.getFeatures().length >= options.size) {
        draw.setActive(false);
      }
    }
  });
  source.on('removefeature', () => {
    if (options.size) {
      if (source.getFeatures().length < options.size) {
        draw.setActive(true);
      }
    }
  });

  const overlaySet = new Set<Overlay>();

  const clearOverlay = () => {
    overlaySet.forEach(overlay => {
      map.removeOverlay(overlay);
    });
    overlaySet.clear();
  };

  source.on('change', () => {
    clearOverlay();
    source.getFeatures().forEach(feature => {
      const geometry = feature.getGeometry() as LineString;
      const center = getExtentCenter(mercatorExtentToWgs84(geometry.getExtent()));
      const element = document.createElement('div');
      if (options.deleteFeatureLabel) {
        render(options.deleteFeatureLabel, element);
      } else {
        element.innerHTML = '删除线';
        element.style.cursor = 'pointer';
        element.style.userSelect = 'none';
        element.style.backgroundColor = 'red';
        element.style.color = 'white';
        element.style.borderRadius = '5px';
        element.style.padding = '0 5px';
        element.style.fontSize = '12px';
        element.style.border = '2px solid white';
      }
      element.addEventListener('click', () => {
        source.removeFeature(feature);
      });
      const overlay = new Overlay({
        position: wgs84ToMercator(center),
        positioning: 'center-center',
        element,
      });
      overlaySet.add(overlay);
      map.addOverlay(overlay);

      const coordinates = geometry.getCoordinates();
      if (coordinates.length < 3) return;
      coordinates.forEach((coordinate, index) => {
        const element = document.createElement('div');
        if (options.deletePointLabel) {
          render(options.deletePointLabel, element);
        } else {
          element.innerHTML = '删除点';
          element.style.cursor = 'pointer';
          element.style.userSelect = 'none';
          element.style.backgroundColor = 'red';
          element.style.color = 'white';
          element.style.borderRadius = '5px';
          element.style.padding = '0 5px';
          element.style.fontSize = '12px';
          element.style.border = '2px solid white';
        }

        element.addEventListener('click', () => {
          feature.setGeometry(new LineString(coordinates.filter((_, i) => i !== index)));
        });
        const overlay = new Overlay({
          position: coordinate,
          positioning: 'top-center',
          offset: [0, -30],
          element,
        });
        overlaySet.add(overlay);
        map.addOverlay(overlay);
      });
    });
  });

  if (options.defaultCoordinates) {
    options.defaultCoordinates.forEach(coordinate => {
      if (coordinate.length < 2) return;
      if (options.size && source.getFeatures().length >= options.size) return;
      const feature = new Feature({
        geometry: new LineString(coordinate),
      });
      source.addFeature(feature);
    });
  }

  const getFeatures = () => {
    return source.getFeatures();
  };

  /** 销毁 */
  const destroy = () => {
    clearOverlay();
    map.removeLayer(layer);
    map.removeInteraction(draw);
    map.removeInteraction(modify);
  };

  return {
    draw,
    source,
    getFeatures,
    destroy,
  };
};

export const useDrawLineString = (map: OLMap, options: DrawLineStringOptions) => {
  const inDraw = ref(true);
  const { draw, source, getFeatures, destroy } = drawLineString(map, options);
  draw.on('change:active', () => {
    inDraw.value = draw.getActive();
  });

  const features = ref<Feature<LineString>[]>([]);

  const coordinates = computed(() => {
    return features.value.map(feature => {
      return feature.getGeometry()?.getCoordinates();
    });
  });

  source.on('change', () => {
    features.value = getFeatures() as Feature<LineString>[];
  });

  onUnmounted(() => {
    destroy();
  });

  return {
    inDraw,
    features,
    coordinates,
  };
};
