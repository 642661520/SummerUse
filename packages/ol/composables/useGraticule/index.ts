import { Graticule } from 'ol/layer';
import { Stroke } from 'ol/style';
import { ref, toValue, watch, type MaybeRef, type Ref } from 'vue';
import type { Map as OLMap } from 'ol';

export const useGraticule = (
  olMapMaybeRef: MaybeRef<OLMap | null | undefined>,
  strokeStyle?: Stroke
) => {
  const showGraticule: Ref<boolean> = ref(false);
  let graticule = new Graticule({
    strokeStyle:
      strokeStyle ||
      new Stroke({
        color: '#000',
        width: 1.5,
        lineDash: [4, 4],
      }),
    showLabels: true,
    wrapX: false,
    zIndex: 1,
  }) as Graticule;

  watch(
    showGraticule,
    enable => {
      graticule.setMap(null);
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
        });
        const olMap = toValue(olMapMaybeRef);
        if (olMap) {
          graticule.setMap(olMap);
        }
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return {
    showGraticule,
  };
};
