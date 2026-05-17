<script lang="ts" setup>
import type { ClickContext, OLMap } from '@summeruse/ol'
import type { Pixel } from 'ol/pixel'
import {
  createOpenStreetMapLayer,
  createPointFeature,
  createVectorLayer,
  OlMap,
  useMapClick,
} from '@summeruse/ol'
import { NCard, NPopover, NTag } from 'naive-ui'
import { Map } from 'ol'
import { ref } from 'vue'

const olMap = new Map()
olMap.addLayer(createOpenStreetMapLayer())

const beijing = createPointFeature([116.3912, 39.9072], {
  id: 'beijing',
  styleOptions: {
    circleOptions: {
      radius: 12,
      fillOptions: { color: '#e74c3c' },
      strokeOptions: { color: '#fff', width: 2 },
    },
  },
  data: { name: '北京', desc: '中华人民共和国首都', population: '2189万' },
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
  data: { name: '上海', desc: '中国最大的经济中心城市', population: '2487万' },
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
  data: { name: '广州', desc: '广东省省会', population: '1868万' },
})

const { source, layer } = createVectorLayer()
source.addFeature(beijing)
source.addFeature(shanghai)
source.addFeature(guangzhou)
olMap.addLayer(layer)

interface CityInfo {
  name: string
  desc: string
  population: string
}

const selectedInfo = ref<CityInfo | null>(null)
const isCapital = ref(false)
const clickPosition = ref({ x: 0, y: 0 })
const showPopover = ref(false)

function showAt(data: CityInfo, pixel: Pixel, map: OLMap) {
  selectedInfo.value = data
  const rect = map.getTargetElement().getBoundingClientRect()
  clickPosition.value = { x: pixel[0] + rect.left, y: pixel[1] + rect.top }
  showPopover.value = true
}

const { add } = useMapClick(olMap, 'singleclick')

add('cities', [
  {
    priority: 10,
    // visible 只允许"北京"通过，展示优先匹配
    visible: (ctx: ClickContext) => ctx.feature?.get('data')?.name === '北京',
    handler: (ctx: ClickContext) => {
      isCapital.value = true
      showAt(ctx.feature!.get('data'), ctx.pixel, ctx.map)
    },
  },
  {
    handler: (ctx: ClickContext) => {
      const data = ctx.feature?.get('data')
      if (data) {
        isCapital.value = false
        showAt(data, ctx.pixel, ctx.map)
      }
      else {
        showPopover.value = false
      }
    },
  },
])

olMap.on('movestart', () => {
  showPopover.value = false
})
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
    >
      <NCard v-if="selectedInfo" size="small" :title="selectedInfo.name">
        <template v-if="isCapital" #header-extra>
          <NTag type="error" size="small">
            首都
          </NTag>
        </template>
        <p>{{ selectedInfo.desc }}</p>
        <NTag :type="isCapital ? 'error' : 'info'">
          人口: {{ selectedInfo.population }}
        </NTag>
      </NCard>
    </NPopover>
  </div>
</template>
