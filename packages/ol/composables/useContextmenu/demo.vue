<script lang="ts" setup>
import type { ContextmenuList, ContextmenuOptions } from '@summeruse/ol'
import type { Feature } from 'ol'
import type { Positioning } from 'ol/Overlay'
import { createOpenStreetMapLayer, createPointFeature, createPolygonFeature, createVectorLayer, OlMap, useContextmenu } from '@summeruse/ol'
import { Map as OLMap, Overlay } from 'ol'
import { h, ref, render, watch } from 'vue'

const olMap = new OLMap()
const { source, layer } = createVectorLayer()

const feature = createPointFeature([0, 0], {
  type: 'point',
  data: {
    name: `点${new Date().getTime()}`,
  },
})
source.addFeature(feature)

const feature2 = createPolygonFeature([
  [
    [1000000, 1000000],
    [1000000, 5000000],
    [5000000, 5000000],
    [5000000, 1000000],
  ],
], {
  type: 'polygon',
  data: {
    name: '多边形',
  },
})
source.addFeature(feature2)
olMap.addLayer(createOpenStreetMapLayer())
olMap.addLayer(layer)
const items = ref<ContextmenuList>([
  {
    label: '添加点',
    key: 'add-point',
    visible: ({ feature }) => !feature,
    action: ({ coordinate }) => {
      const feature = createPointFeature(coordinate, {
        type: 'point',
        data: {
          name: `点${new Date().getTime()}`,
        },
      })
      source.addFeature(feature)
    },
  },
  {
    label: ({ feature }) => `删除${feature?.get('data')?.name || '点'}`,
    key: 'delete-point',
    visible: ({ feature }) => feature?.get('type') === 'point',
    action: ({ feature }) => {
      feature && source.removeFeature(feature as Feature)
    },
  },
  {
    label: '多边形区域',
    key: 'delete-polygon',
    visible: ({ feature }) => feature?.get('type') === 'polygon',
    children: [
      {
        label: '删除多边形',
        key: 'delete-polygon',
        visible: ({ feature }) => feature?.get('type') === 'polygon',
        action: ({ feature }) => {
          feature && source.removeFeature(feature as Feature)
        },
      },
    ],
  },
  {
    label: '清空点',
    divided: true,
    key: 'clear-point',
    action: () => {
      source.forEachFeature((feature) => {
        if (feature.get('type') === 'point') {
          source.removeFeature(feature)
        }
      })
    },
  },
])

const { visible, options, coordinate, position } = useContextmenu(olMap, items)

const container = document.createElement('div')
container.classList.add('contextmenu-container')
const content = document.createElement('div')
content.style.width = '200px'
content.style.height = '200px'
container.style.display = 'none'
container.appendChild(content)
const overlay = new Overlay({
  element: container,
  // stopEvent: true,
  positioning: 'top-left',
  position: [0, 0],
})
olMap.addOverlay(overlay)

function createContextmenu(container: HTMLElement, options: ContextmenuOptions) {
  options.forEach((option) => {
    if (option.divided) {
      const divider = document.createElement('div')
      divider.classList.add('contextmenu-divider')
      container.appendChild(divider)
    }
    const item = document.createElement('div')
    item.classList.add('contextmenu-item')
    if (option.disabled) {
      item.classList.add('contextmenu-item-disabled')
    }
    const label = option.label
    if (typeof label === 'function') {
      const node = h(label, option.props)
      render(node, item)
    }
    else {
      item.innerHTML = label
    }

    container.appendChild(item)
    if (option.children) {
      const subContainer = document.createElement('div')
      subContainer.classList.add('contextmenu-container')
      item.appendChild(subContainer)
      createContextmenu(subContainer, option.children)
    }
    else {
      item.onclick = option.action
    }
  })
}

watch([visible, coordinate], ([visible, coordinate]) => {
  if (visible && coordinate) {
    container.innerHTML = ''
    container.style.display = 'block'
    container.style.visibility = 'hidden'
    createContextmenu(container, options.value)

    const mapEl = olMap.getTargetElement() || olMap.getViewport()
    const mapRect = mapEl.getBoundingClientRect()
    const menuRect = container.getBoundingClientRect()
    let positioning: Positioning = 'top-left'
    const rightOverflow = position.value.x + menuRect.width > mapRect.right
    const bottomOverflow = position.value.y + menuRect.height > mapRect.bottom
    if (rightOverflow) {
      positioning = 'top-right'
    }
    if (bottomOverflow) {
      positioning = 'bottom-left'
    }
    if (rightOverflow && bottomOverflow) {
      positioning = 'bottom-right'
    }
    overlay.setPositioning(positioning)
    overlay.setPosition(coordinate)
    container.style.visibility = 'visible'
  }
  else {
    container.style.display = 'none'
  }
})
</script>

<template>
  <OlMap :ol-map class="w-100% h-400px" />
</template>

<style lang="scss">
  .contextmenu-container {
    background-color: #000;
    color: white;
    padding: 5px 0;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    font-size: 14px;

    .contextmenu-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.5);
      margin: 2px 0;
    }

    .contextmenu-item {
      margin:0 5px;
      padding: 2px 10px;
      cursor: pointer;
      border-radius: 5px;
      position: relative;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);

        .contextmenu-container {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;

          .contextmenu-item {
            width: max-content;
          }
        }
      }

      .contextmenu-container {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(100%, 0);
      }
    }
  }
</style>
