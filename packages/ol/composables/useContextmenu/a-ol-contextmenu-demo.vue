<script lang="ts" setup>
import type { ContextmenuItem, ContextmenuOption } from '@summeruse/ol'
import type { OLMap } from 'packages/ol/types'
import { useContextmenu } from '@summeruse/ol'
import { Menu } from 'ant-design-vue'
import { computed } from 'vue'

const props = defineProps<{
  map: OLMap
  items: Array<ContextmenuItem>
}>()

const { visible, options, position } = useContextmenu(props.map, props.items)

function formatOptions(option: ContextmenuOption[]) {
  let key = 0
  return option.reduce((prev, cur) => {
    if (cur.divided) {
      prev.push({
        type: 'divider',
      })
    }
    if (cur.children) {
      prev.push({
        label: cur.label,
        key: cur.key ?? `_${key++}`,
        title: '',
        children: formatOptions(cur.children),
        action: cur.action,
      })
    }
    else {
      prev.push({
        label: cur.label,
        key: cur.key ?? `_${key++}`,
        action: cur.action,
      })
    }
    return prev
  }, [] as any[])
}

const items = computed(() => formatOptions(options.value))

function handleClick(e: any) {
  e.item.action()
}
</script>

<template>
  <div
    v-show="visible" :style="{
      position: 'fixed',
      zIndex: 1000,
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <Menu :items="items" style="margin: 0; padding: 0;border-radius: 8px;" @click="handleClick" @contextmenu.prevent />
  </div>
</template>
