import type { Map as OLMap } from 'ol';
import type TileLayer from 'ol/layer/Tile';
import { ref, watch } from 'vue';

export const useSwitchBaseLayer = (data: {
  olMap: OLMap;
  defaultLayerName?: string;
  layers: {
    [key: string]: TileLayer[];
  };
}) => {
  const visibleLayerName = ref(data.defaultLayerName || Object.keys(data.layers)[0]);
  Object.values(data.layers).map(list => {
    list.map(layer => {
      data.olMap.addLayer(layer);
    });
  });

  watch(
    visibleLayerName,
    () => {
      Object.entries(data.layers).map(([name, list]) => {
        const visible = name === visibleLayerName.value;
        list.map(layer => {
          layer.setVisible(visible);
        });
      });
    },
    {
      immediate: true,
    }
  );

  return { visibleLayerName };
};
