<script lang="ts" setup>
import type { ContextmenuItem } from '@summeruse/ol'
import type { DropdownInstance } from 'element-plus'
import type { OLMap } from 'packages/ol/types'
import { useContextmenu } from '@summeruse/ol'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps<{
  map: OLMap
  items: Array<ContextmenuItem>
}>()

const dropdownRef = ref<DropdownInstance>()

const { visible, options, position } = useContextmenu(props.map, props.items)

watch(visible, (show) => {
  if (show) {
    dropdownRef.value?.handleOpen()
  }
  else {
    dropdownRef.value?.handleClose()
  }
})

const triggerRef = ref({
  getBoundingClientRect: () => DOMRect.fromRect({
    x: position.value.x,
    y: position.value.y,
  }),
})
</script>

<template>
  <ElDropdown
    ref="dropdownRef" :virtual-ref="triggerRef" :show-arrow="false" :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
    }" virtual-triggering trigger="contextmenu" placement="bottom-start"
  >
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item in options" :key="item.key" :icon="item.icon" :disabled="item.disabled"
          :divided="item.divided"
          :command="item.key"
          @click="item.action"
        >
          {{ item.label
          }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
