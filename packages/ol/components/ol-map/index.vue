<script lang="ts" setup>
import type { MapEvent } from 'ol'
import type { ObjectEvent } from 'ol/Object'
import type { OlMapEmits, OlMapProps } from './props'
import { Map as OLMap, View } from 'ol'
import { Attribution, FullScreen, OverviewMap, Rotate, ScaleLine, Zoom } from 'ol/control'
import { DoubleClickZoom, DragPan, DragRotate, KeyboardPan, KeyboardZoom, MouseWheelZoom, PinchRotate, PinchZoom } from 'ol/interaction'
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { olMapInjectionKey } from './props'

defineOptions({
  name: 'OlMap',
})

const props = withDefaults(defineProps<OlMapProps>(), {
  olMap: () => new OLMap(),
  center: () => [0, 0],
  zoom: 2,
  maxZoom: 18,
  minZoom: 2,
  showZoom: false,
  showAttribution: false,
  showRotate: false,
  showFullScreen: false,
  showOverview: false,
  showScale: false,
  dragPan: true,
  doubleClickZoom: false,
  mouseWheelZoom: true,
  constrainResolution: true,
})

const emits = defineEmits<OlMapEmits>()

// #region init
const mapRef = ref<HTMLDivElement>()
const olMap = props.olMap as OLMap
const view = new View({
  projection: props.projection,
  extent: props.extent,
})

olMap.setView(view)

view.setZoom(props.zoom)

view.setCenter(props.center)

watch(() => props.constrainResolution, (val) => {
  view.setConstrainResolution(val)
}, {
  immediate: true,
})

watch(() => props.minZoom, (val) => {
  if (val) {
    view.setMinZoom(val)
  }
}, {
  immediate: true,
})

watch(() => props.maxZoom, (val) => {
  if (val) {
    view.setMaxZoom(val)
  }
}, {
  immediate: true,
})

watch(mapRef, (val) => {
  if (val) {
    olMap.setTarget(val)
  }
})

defineExpose({
  olMap,
})

provide(olMapInjectionKey, olMap)
// #endregion

// #region controls
const controls = olMap.getControls().getArray()

const zoomControl = controls.find(control => control instanceof Zoom) || new Zoom()
const attributionControl = controls.find(control => control instanceof Attribution) || new Attribution()
const rotateControl = controls.find(control => control instanceof Rotate) || new Rotate()
const fullScreenControl = controls.find(control => control instanceof FullScreen) || new FullScreen()
const overviewMapControl = controls.find(control => control instanceof OverviewMap) || new OverviewMap()
const scaleControl = controls.find(control => control instanceof ScaleLine) || new ScaleLine()

watch(() => props.showZoom, (val) => {
  zoomControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})

watch(() => props.showAttribution, (val) => {
  attributionControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})

watch(() => props.showRotate, (val) => {
  rotateControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})

watch(() => props.showFullScreen, (val) => {
  fullScreenControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})

watch(() => props.showOverview, (val) => {
  overviewMapControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})

watch(() => props.showScale, (val) => {
  scaleControl.setMap(val ? olMap : null)
}, {
  immediate: true,
})
// #endregion

// #region interactions
const interactions = olMap.getInteractions().getArray()
const dragPan = interactions.find(i => i instanceof DragPan) || new DragPan()
const mouseWheelZoom = interactions.find(i => i instanceof MouseWheelZoom) || new MouseWheelZoom()
const doubleClickZoom = interactions.find(i => i instanceof DoubleClickZoom) || new DoubleClickZoom()
const pinchRotate = interactions.find(i => i instanceof PinchRotate) || new PinchRotate()
const pinchZoom = interactions.find(i => i instanceof PinchZoom) || new PinchZoom()
const altShiftDragRotate = interactions.find(i => i instanceof DragRotate) || new DragRotate()
const keyboardPan = interactions.find(i => i instanceof KeyboardPan) || new KeyboardPan()
const keyboardZoom = interactions.find(i => i instanceof KeyboardZoom) || new KeyboardZoom()
olMap.removeInteraction(dragPan)
olMap.addInteraction(dragPan)
olMap.removeInteraction(mouseWheelZoom)
olMap.addInteraction(mouseWheelZoom)
olMap.removeInteraction(doubleClickZoom)
olMap.addInteraction(doubleClickZoom)
olMap.removeInteraction(pinchRotate)
olMap.addInteraction(pinchRotate)
olMap.removeInteraction(pinchZoom)
olMap.addInteraction(pinchZoom)
olMap.removeInteraction(altShiftDragRotate)
olMap.addInteraction(altShiftDragRotate)
olMap.removeInteraction(keyboardPan)
olMap.removeInteraction(keyboardZoom)

watch(() => props.dragPan, (val) => {
  dragPan.setActive(val)
}, {
  immediate: true,
})
watch(() => props.mouseWheelZoom, (val) => {
  mouseWheelZoom.setActive(val)
}, {
  immediate: true,
})
watch(() => props.doubleClickZoom, (val) => {
  doubleClickZoom.setActive(val)
}, {
  immediate: true,
})
watch(() => props.pinchRotate, (val) => {
  pinchRotate.setActive(val)
}, {
  immediate: true,
})
watch(() => props.pinchZoom, (val) => {
  pinchZoom.setActive(val)
}, {
  immediate: true,
})
watch(() => props.altShiftDragRotate, (val) => {
  altShiftDragRotate.setActive(val)
}, {
  immediate: true,
})
// #endregion

// #region event

// #region change:resolution
function changeResolution(e: ObjectEvent) {
  emits('update:zoom', Math.floor(view.getZoom() || 0))
  emits('changeResolution', e)
}

onMounted(() => {
  view.on('change:resolution', changeResolution)
})

onUnmounted(() => {
  view.un('change:resolution', changeResolution)
})
// #endregion

// #region change:center
function changeCenter(e: ObjectEvent) {
  emits('update:center', view.getCenter() || [0, 0])
  emits('changeCenter', e)
}

onMounted(() => {
  view.on('change:center', changeCenter)
})

onUnmounted(() => {
  view.un('change:center', changeCenter)
})
// #endregion

// #region movestart, moveend
function movestart(e: MapEvent) {
  emits('movestart', e)
}
onMounted(() => {
  olMap.on('movestart', movestart)
})

onUnmounted(() => {
  olMap.un('movestart', movestart)
})

function moveend(e: MapEvent) {
  emits('moveend', e)
}
onMounted(() => {
  olMap.on('moveend', moveend)
})

onUnmounted(() => {
  olMap.un('moveend', moveend)
})
// #endregion

// #endregion
</script>

<template>
  <div ref="mapRef">
    <slot :ol-map :map-ref />
  </div>
</template>
