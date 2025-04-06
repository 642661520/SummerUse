<template>
  <NConfigProvider>
    <NCard title="航线列表" class="mb-2">
      <NDataTable :columns :data="lineList" />
      <NButton @click="addLine">添加航线</NButton>
      <NButton @click="saveLine" :disabled="!isDraw">保存</NButton>
    </NCard>
    <OlMap ref="olMapInst" class="w-100% h-400px" :zoom="10" :center="wgs84ToMercator([120, 30])" :olMap></OlMap>
  </NConfigProvider>
</template>
<script lang="ts" setup>
  import { getOSMLayer, OlMap, wgs84ToMercator } from '@summeruse/ol';
  import type { OlMapInst } from '@summeruse/ol';
  import { h, onMounted, ref, watch } from 'vue';
  import { Feature, Map as OLMap } from 'ol';
  import { useDrawLineString } from '.';
  import { Stroke, Style } from 'ol/style';
  import { NButton, NCard, NDataTable, NConfigProvider } from 'naive-ui';
  import type { Coordinate } from 'ol/coordinate';
  import VectorSource from 'ol/source/Vector';
  import VectorLayer from 'ol/layer/Vector';
  import { LineString } from 'ol/geom';
  const olMapInst = ref<OlMapInst>();
  const olMap = new OLMap();
  olMap.addLayer(getOSMLayer());

  type Line = {
    id: number;
    name: string;
    coordinates: Coordinate[];
  }

  const lineList = ref<Line[]>([]);

  const getData = () => {
    // 模拟数据
    return new Promise<Line[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '航线1',
            coordinates: [[13319814.6329371, 3473861.2239869847], [13324095.10652107, 3480281.9343629396], [13328834.20227475, 3483033.667381206], [13331127.313123306, 3487467.015021746], [13335713.534820417, 3488078.5112480274], [13340299.756517528, 3491900.3626622865], [13342592.867366083, 3496639.4584159674], [13346720.466893481, 3497709.57681196]],
          },
          {
            id: 2,
            name: '航线2',
            coordinates: [[13382340.122074375, 3532777.4521949184], [13378824.018773258, 3530637.2154029333], [13374084.923019577, 3529108.47483723], [13371333.19000131, 3527579.7342715263], [13372250.434340732, 3523452.134744127], [13376989.530094413, 3519171.661160157], [13378365.396603547, 3516725.6762550315]]
          }
        ])
      }, 100)
    })
  }

  const columns = [
    {
      title: '名称',
      key: 'name',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      render(row) {
        return h('div', {
          class: 'flex justify-center items-center gap-2'
        }, [h(
          NButton,
          {
            type: 'info',
            disabled: isDraw.value,
            onClick: () => {
              editLine(row);
            }
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            type: 'error',
            disabled: isDraw.value,
            onClick: () => {
              lineList.value = lineList.value.filter(item => item.id !== row.id);
            }
          },
          { default: () => '删除' }
        )
        ])
      }
    }
  ]

  const source = new VectorSource();
  const vectorLayer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2,
      }),
    })
  });
  olMap.addLayer(vectorLayer);

  watch(() => lineList.value, (newVal) => {
    source.clear();
    newVal.forEach((item) => {
      const feature = new Feature({
        geometry: new LineString(item.coordinates),
      });
      source.addFeature(feature);
    })
  }, {
    deep: true,
    immediate: true
  });

  const isDraw = ref(false);

  const drawId = ref<number>();

  const { start, stop, coordinates, setFeatures } = useDrawLineString(olMap, {
    size: 1
  });

  const editLine = (line?: Line) => {
    vectorLayer.setOpacity(0.2);
    isDraw.value = true;
    drawId.value = line?.id || undefined;
    setFeatures(line ? [line.coordinates] : []);
    start();
  }

  const addLine = () => {
    editLine();
  }

  const saveLine = () => {
    if (drawId.value) {
      const index = lineList.value.findIndex(item => item.id === drawId.value);
      lineList.value[index].coordinates = coordinates.value[0];
    } else {
      lineList.value.push({
        id: lineList.value.length + 1,
        name: `航线${lineList.value.length + 1}`,
        coordinates: coordinates.value[0]
      })
    }
    setFeatures([]);
    stop();
    isDraw.value = false;
    drawId.value = undefined;
    vectorLayer.setOpacity(1);
  }


  onMounted(async () => {
    const res = await getData();
    lineList.value = res;
  })
</script>