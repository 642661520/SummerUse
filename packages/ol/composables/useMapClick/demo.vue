<script lang="ts" setup>
import type { ClickContext } from '@summeruse/ol'
import {
  createOpenStreetMapLayer,
  createPointFeature,
  createStyle,
  createVectorLayer,
  OlMap,
  useMapClick,
} from '@summeruse/ol'
import { NCard, NPopover, NTag } from 'naive-ui'
import { Map as OLMap } from 'ol'
import { h, ref } from 'vue'

const olMap = new OLMap()
olMap.addLayer(createOpenStreetMapLayer())

// 创建几个城市点位
const beijing = createPointFeature([116.3912, 39.9072], {
  id: 'beijing',
  styleOptions: {
    circleOptions: {
      radius: 12,
      fillOptions: { color: '#e74c3c' },
      strokeOptions: { color: '#fff', width: 2 },
    },
  },
  data: {
    name: '北京',
    desc: '中华人民共和国首都',
    population: '2189万',
  },
})

const shanghai = createPointFeature([121.4737, 31.2304], {
  id: 'shanghai',
  styleOptions: {
    circleOptions: {
      radius: 10,
      fillOptions: { color: '#3498db' },
      strokeOptions: { color: '#fff', width: 2 },
    },
  },
  data: {
    name: '上海',
    desc: '中国最大的经济中心城市',
    population: '2487万',
  },
})

const guangzhou = createPointFeature([113.2644, 23.1291], {
  id: 'guangzhou',
  styleOptions: {
    circleOptions: {
      radius: 8,
      fillOptions: { color: '#2ecc71' },
      strokeOptions: { color: '#fff', width: 2 },
    },
  },
  data: {
    name: '广州',
    desc: '广东省省会',
    population: '1868万',
  },
})

const { source, layer } = createVectorLayer({
  style: (feature) => {
    return createStyle(feature.get('styleOptions'))
  },
})
source.addFeature(beijing)
source.addFeature(shanghai)
source.addFeature(guangzhou)
olMap.addLayer(layer)

// 选中信息
const selectedInfo = ref<{
  name: string
  desc: string
  population: string
} | null>(null)

const clickPosition = ref({ x: 0, y: 0 })
const showPopover = ref(false)

// 注册点击处理
const { add } = useMapClick(olMap, 'singleclick')

add('city-click', [{
  priority: 10,
  handler: (ctx: ClickContext) => {
    const data = ctx.feature?.get('data')
    if (data) {
      selectedInfo.value = data
      clickPosition.value = {
        x: ctx.pixel[0],
        y: ctx.pixel[1],
      }
      showPopover.value = true
    }
  },
}])

// 点击空白处关闭
add('blank-click', [{
  handler: () => {
    showPopover.value = false
    selectedInfo.value = null
  },
}])
</script>

<template>
  <div class="relative">
    <OlMap
      class="w-100% h-400px"
      :center="[116.3912, 39.9072]"
      :zoom="5"
      projection="EPSG:4326"
      :ol-map
    />
    <NPopover
      trigger="manual"
      :show="showPopover"
      :x="clickPosition.x"
      :y="clickPosition.y"
      :arrow-style="{ pointerEvents: 'none' }"
      style="pointer-events: none"
    >
      <NCard v-if="selectedInfo" size="small" :title="selectedInfo.name">
        <p>{{ selectedInfo.desc }}</p>
        <NTag type="info">
          人口: {{ selectedInfo.population }}
        </NTag>
      </NCard>
    </NPopover>
  </div>
</template>
