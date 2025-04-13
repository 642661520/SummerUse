<script lang="ts" setup>
import type { Property } from 'cesium'
import type { CreateOptions } from './props'
import { getOSMLayer, useCeiusmViewer } from '@summeruse/cesium'
import {
  Cartesian3,
  Color,
  Entity,
  HeightReference,
} from 'cesium'
import NCesiumPointermove from './index.vue'

const viewer = useCeiusmViewer()!

const layer = getOSMLayer()
viewer.imageryLayers.add(layer)

const entity = new Entity({
  position: Cartesian3.fromDegrees(116.397428, 39.90923, 50.0),
  ellipsoid: {
    radii: new Cartesian3(100.0, 100.0, 100.0),
    innerRadii: new Cartesian3(1.0, 1.0, 1.0),
    material: Color.DARKCYAN.withAlpha(0.1),
    outline: true,
    heightReference: HeightReference.NONE,
  },
  properties: {
    name: '圆',
    data: {
      xx: '123',
    },
  },
})

entity.addProperty('data')

const createOptions: CreateOptions = ({ feature }) => {
  if (feature) {
    if (feature instanceof Entity) {
      const properties = feature.properties
      if (properties) {
        const data = properties.data as Property
        const name = properties.name as Property
        return {
          content: `${data.getValue().xx} - ${name}`,
          showArrow: false,
        }
      }
    }
  }
}

viewer.entities.add(entity)
viewer.flyTo(entity)
</script>

<template>
  <NCesiumPointermove :viewer :create-options />
</template>
