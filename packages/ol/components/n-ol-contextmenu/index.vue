<script lang="ts" setup>
import type { DropdownMixedOption, DropdownOption } from 'naive-ui/es/dropdown/src/interface'
import type { NOlContextmenuProps } from './props'
import { NDropdown } from 'naive-ui'
import { onMounted, ref } from 'vue'

const props = defineProps<NOlContextmenuProps>()
const { olMap } = props

const dropdownConfig = ref({
  visible: false,
  x: 0,
  y: 0,
})

function onClickoutside() {
  dropdownConfig.value.visible = false
}

const dropdownOptions = ref<DropdownMixedOption[]>()

onMounted(() => {
  const viewport = olMap.getViewport()
  if (viewport) {
    viewport.oncontextmenu = (event) => {
      event.preventDefault()
      const pixel = olMap.getEventPixel(event)
      const coordinate = olMap.getEventCoordinate(event)
      const features = olMap.getFeaturesAtPixel(pixel)
      dropdownOptions.value = props.createOptions({ event, pixel, coordinate, features })
      dropdownConfig.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
      }
    }
  }
})

function handleSelect(_: string, option: DropdownOption) {
  const { onClick } = option as any
  if (onClick) {
    onClick()
  }
  dropdownConfig.value.visible = false
}
</script>

<template>
  <NDropdown
    placement="bottom-start" trigger="manual"
    :show="dropdownOptions && dropdownOptions.length > 0 && dropdownConfig.visible" :x="dropdownConfig.x"
    :y="dropdownConfig.y" :options="dropdownOptions" :on-clickoutside="onClickoutside" @select="handleSelect"
  />
</template>
