<template>
  <NConfigProvider>
    <NCard title="区域列表" class="mb-2">
      <NDataTable :columns :data="areaList" />
      <NButton @click="addLine">添加区域</NButton>
      <NButton @click="saveLine" :disabled="!isDraw">保存</NButton>
    </NCard>
    <OlMap ref="olMapInst" class="w-100% h-400px" :zoom="10" :center :olMap></OlMap>
    {{ coordinates }}
  </NConfigProvider>
</template>
<script lang="ts" setup>
  import { getOSMLayer, wgs84ToMercator, OlMap, useDrawPolygon, createVectorLayer, createStyle } from '@summeruse/ol';
  import type { OlMapInst } from '@summeruse/ol';
  import { h, onMounted, ref, watch } from 'vue';
  import { Feature, Map as OLMap } from 'ol';
  import { NButton, NCard, NDataTable, NConfigProvider } from 'naive-ui';
  import type { Coordinate } from 'ol/coordinate';
  import { Polygon } from 'ol/geom';
  const olMapInst = ref<OlMapInst>();
  const olMap = new OLMap();
  olMap.addLayer(getOSMLayer());

  const center = wgs84ToMercator([120, 30]);

  type Area = {
    id: number;
    name: string;
    coordinates: Coordinate[][];
  }

  const areaList = ref<Area[]>([]);

  const getData = () => {
    // 模拟数据
    return new Promise<Area[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '区域1',
            coordinates: [[[13349319.325855177, 3521923.394178423], [13375307.91547214, 3510610.713992217], [13363077.99094651, 3487985.353619805], [13338618.141895253, 3501591.1446545664], [13349319.325855177, 3521923.394178423]]],
          },
          {
            id: 2,
            name: '区域2',
            coordinates: [[[13382340.122074375, 3532777.4521949184], [13378824.018773258, 3530637.2154029333], [13374084.923019577, 3529108.47483723], [13371333.19000131, 3527579.7342715263], [13372250.434340732, 3523452.134744127], [13376989.530094413, 3519171.661160157], [13378365.396603547, 3516725.6762550315], [13393347.05414744, 3525592.371536112], [13382340.122074375, 3532777.4521949184], [13382340.122074375, 3532777.4521949184]]]
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
              areaList.value = areaList.value.filter(item => item.id !== row.id);
            }
          },
          { default: () => '删除' }
        )
        ])
      }
    }
  ]

  const { source, layer: vectorLayer } = createVectorLayer({
    style: createStyle({
      strokeOptions: {
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2
      }
    })
  });
  olMap.addLayer(vectorLayer);

  watch(() => areaList.value, (newVal) => {
    source.clear();
    newVal.forEach((item) => {
      const feature = new Feature({
        geometry: new Polygon(item.coordinates),
      });
      source.addFeature(feature);
    })
  }, {
    deep: true,
    immediate: true
  });

  const isDraw = ref(false);

  const drawId = ref<number>();

  const { start, stop, coordinates, setFeatures, features } = useDrawPolygon(olMap, {
    size: 1
  });

  const editLine = (area?: Area) => {
    vectorLayer.setOpacity(0.2);
    isDraw.value = true;
    drawId.value = area?.id || undefined;
    setFeatures(area ? [area.coordinates] : undefined);
    start();
  }

  const addLine = () => {
    editLine();
  }

  const saveLine = () => {
    if (features.value.length === 0) return alert('请先绘制多边形');
    if (drawId.value) {
      const index = areaList.value.findIndex(item => item.id === drawId.value);
      areaList.value[index].coordinates = coordinates.value[0];
    } else {
      areaList.value.push({
        id: areaList.value.length + 1,
        name: `航线${areaList.value.length + 1}`,
        coordinates: coordinates.value[0]
      })
    }
    setFeatures();
    stop();
    isDraw.value = false;
    drawId.value = undefined;
    vectorLayer.setOpacity(1);
  }


  onMounted(async () => {
    const res = await getData();
    areaList.value = res;
  })
</script>