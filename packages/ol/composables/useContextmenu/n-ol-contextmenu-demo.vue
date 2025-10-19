<script lang="ts" setup>
import type { ContextmenuItem, ContextmenuOption } from '@summeruse/ol'
import type { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption } from 'naive-ui'
import type { OLMap } from 'packages/ol/types'
import { useContextmenu } from '@summeruse/ol'
import { NDropdown } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  map: OLMap
  items: ContextmenuItem[]
}>()

const { visible, options, position, hide } = useContextmenu(props.map, props.items)

  type DropdownOptions = Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>

function formatOptions(option: ContextmenuOption[]): DropdownOptions {
  return option.reduce((prev, cur) => {
    if (cur.divided) {
      prev.push({
        type: 'divider',
      })
    }
    if (cur.children) {
      prev.push({
        label: cur.label,
        key: cur.key,
        children: formatOptions(cur.children),
        action: cur.action,
      })
    }
    else {
      prev.push({
        label: cur.label,
        key: cur.key,
        action: cur.action,
      })
    }
    return prev
  }, [] as DropdownOptions)
}

const dropdownOptions = computed(() => formatOptions(options.value))

function handleSelect(_: string, option: DropdownOption) {
  const action = option.action as () => void
  action()
}
</script>

<template>
  <NDropdown
    trigger="manual" placement="bottom-start" :show="visible" :x="position?.x" :y="position?.y"
    :options="dropdownOptions" @contextmenu.prevent @clickoutside="hide" @select="handleSelect"
  />
</template>
