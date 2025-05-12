<script lang="ts" setup>
import { useLayer } from '@summeruse/ui'
import { NCheckbox, NForm, NFormItem, NInputNumber, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'

const container = ref<HTMLElement>()

const header = ref<HTMLElement>()

const content = ref<HTMLElement>()

const parentRef = ref<HTMLElement>()

const minWidth = ref(100)
const minHeight = ref(100)
const maxWidth = ref(600)
const maxHeight = ref(150)

const disabledResize = ref(false)
const disabledDrag = ref(false)

const initRect = ref({
  width: 300,
  height: 100,
  x: 850,
  y: 500,
})

const isRatio = ref(true)

const ratio = computed(() => {
  if (isRatio.value)
    return initRect.value.width / initRect.value.height
  else
    return undefined
})

const parentValue = ref('body')

const parentOptions = [{
  label: 'parent',
  value: 'parent',
}, {
  label: 'body',
  value: 'body',
}]

const parent = computed(() => {
  if (parentValue.value === 'parent') {
    return parentRef.value
  }
  return document.body
})

const allowOverParent = ref(false)

const dragValue = ref('container')

const dragOptions = [{
  label: 'container',
  value: 'container',
}, {
  label: 'header',
  value: 'header',
}, {
  label: 'content',
  value: 'content',
}]

const dragElement = computed(() => {
  if (dragValue.value === 'header') {
    return header.value
  }
  else if (dragValue.value === 'content') {
    return content.value
  }
  return container.value
})

const directions = ref({
  'left': true,
  'right': true,
  'top': true,
  'bottom': true,
  'top-left': true,
  'top-right': true,
  'bottom-left': true,
  'bottom-right': true,
})

const { rect } = useLayer(container, {
  directions,
  initRect,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  ratio,
  disabledResize,
  disabledDrag,
  parent,
  allowOverParent,
  dragElement,
})

const style = computed(() => {
  return {
    width: `${rect.value.width}px`,
    height: `${rect.value.height}px`,
    left: `${rect.value.x}px`,
    top: `${rect.value.y}px`,
  }
})
</script>

<template>
  <Teleport to="body">
    <div ref="parentRef" class="fixed w-800px h-350px bg-#abf5 z--1 top-400px left-350px pointer-events-none">
      parent
    </div>
  </Teleport>
  <NForm label-placement="left" label-width="120px" class="flex flex-wrap">
    <NFormItem label="Disabled Resize">
      <NCheckbox v-model:checked="disabledResize" />
    </NFormItem>
    <NFormItem label="Disabled Drag">
      <NCheckbox v-model:checked="disabledDrag" />
    </NFormItem>
    <NFormItem label="Is Ratio">
      <NCheckbox v-model:checked="isRatio" />
    </NFormItem>
    <NFormItem label="Over Parent">
      <NCheckbox v-model:checked="allowOverParent" />
    </NFormItem>
    <NFormItem label="parent">
      <NSelect v-model:value="parentValue" :options="parentOptions" />
    </NFormItem>
    <NFormItem label="drag Element">
      <NSelect v-model:value="dragValue" :options="dragOptions" />
    </NFormItem>
    <NFormItem label="Resize">
      <NCheckbox v-model:checked="directions.left">
        left
      </NCheckbox>
      <NCheckbox v-model:checked="directions.right">
        right
      </NCheckbox>
      <NCheckbox v-model:checked="directions.top">
        top
      </NCheckbox>
      <NCheckbox v-model:checked="directions.bottom">
        bottom
      </NCheckbox>
    </NFormItem>
    <NFormItem label="directions">
      <NCheckbox v-model:checked="directions['top-left']">
        top-left
      </NCheckbox>
      <NCheckbox v-model:checked="directions['top-right']">
        top-right
      </NCheckbox>
      <NCheckbox v-model:checked="directions['bottom-left']">
        bottom-left
      </NCheckbox>
      <NCheckbox v-model:checked="directions['bottom-right']">
        bottom-right
      </NCheckbox>
    </NFormItem>
    <NFormItem label="Init Width">
      <NInputNumber v-model:value="initRect.width" />
    </NFormItem>
    <NFormItem label="Init Height">
      <NInputNumber v-model:value="initRect.height" />
    </NFormItem>
    <NFormItem label="Init X">
      <NInputNumber v-model:value="initRect.x" />
    </NFormItem>
    <NFormItem label="Init Y">
      <NInputNumber v-model:value="initRect.y" />
    </NFormItem>
    <NFormItem label="Min Width">
      <NInputNumber v-model:value="minWidth" />
    </NFormItem>
    <NFormItem label="Min Height">
      <NInputNumber v-model:value="minHeight" />
    </NFormItem>
    <NFormItem label="Max Width">
      <NInputNumber v-model:value="maxWidth" />
    </NFormItem>
    <NFormItem label="Max Height">
      <NInputNumber v-model:value="maxHeight" />
    </NFormItem>
  </NForm>

  <Teleport to="body">
    <div ref="container" class="fixed flex flex-col z-1000 bg-black text-#fff" :style>
      <div ref="header" class="h-20px bg-#abf">
        header
      </div>
      <div ref="content" class="h-100%">
        {{ rect.width }} * {{ rect.height }}
      </div>
    </div>
  </Teleport>
</template>
