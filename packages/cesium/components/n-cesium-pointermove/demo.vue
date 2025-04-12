<script lang="ts" setup>
import type { Property } from 'cesium'
import type { CreateOptions } from './props'
import {
  Cartesian3,
  Color,
  Entity,
  HeightReference,
  ImageryLayer,
  OpenStreetMapImageryProvider,
  Viewer,
} from 'cesium'
import { nextTick, shallowRef, watchEffect } from 'vue'
import NCesiumPointermove from './index.vue'

const viewer = shallowRef<Viewer>()

const cesiumRef = shallowRef<HTMLElement>()

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

watchEffect(() => {
  if (cesiumRef.value) {
    viewer.value = new Viewer(cesiumRef.value, {
      baseLayer: new ImageryLayer(
        new OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        }),
      ),
      shouldAnimate: true,
      infoBox: false,
      selectionIndicator: false,
      baseLayerPicker: false,
      timeline: false,
      animation: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      scene3DOnly: true,
    })
    viewer.value.entities.add(entity)
    nextTick(() => {
      viewer.value?.flyTo(entity)
    })
  }
})
</script>

<template>
  <div ref="cesiumRef">
    <NCesiumPointermove :viewer :create-options />
  </div>
</template>
