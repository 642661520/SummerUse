<template>
  <div ref="cesiumRef">
    <NCesiumPointermove :viewer :createOptions></NCesiumPointermove>
  </div>
</template>
<script lang="ts" setup>
  import { Cartesian3, Color, Entity, HeightReference, ImageryLayer, OpenStreetMapImageryProvider, Property, Viewer, WebMapTileServiceImageryProvider } from 'cesium';
  import { watchEffect } from 'vue';
  import NCesiumPointermove from './index.vue';
  import type { CreateOptions } from './props';
  import { ref } from 'vue';
  import { nextTick } from 'vue';

  const viewer = ref<Viewer>();

  const cesiumRef = ref<HTMLElement>();

  const entity = new Entity({
    // description: ,
    position: Cartesian3.fromDegrees(
      116.397428,
      39.90923,
      5000.0
    ),
    ellipsoid: {
      radii: new Cartesian3(20000.0, 20000.0, 20000.0),
      innerRadii: new Cartesian3(1.0, 1.0, 1.0),
      material: Color.DARKCYAN.withAlpha(0.1),
      outline: true,
      heightReference: HeightReference.NONE,
    },
    properties: {
      name: '圆',
      data: {
        xx: '123',
      }
    }
  });

  entity.addProperty('data');
  // entity.data = '123';

  const createOptions: CreateOptions = ({ movement, feature }) => {
    if (feature) {
      if (feature instanceof Entity) {
        const properties = feature.properties;
        // console.log(properties);
        if (properties) {
          const data = properties.data as Property;
          const name = properties.name as Property;
          return {
            content: `${data.getValue().xx} - ${name}`,
            placement: 'bottom-start',
            showArrow: false,
            // raw: true,
          }
        }
      }
    }
  }


  //#region 初始化地图
  type TMapType =
    | 'vec'
    | 'cva'
    | 'img'
    | 'cia'
    | 'ter'
    | 'cta'
    | 'ibo'
    | 'eva'
    | 'eia';
  /**
   * cesium 天地图
   * @param viewer
   * @param layer
   * vec：矢量底图、cva：矢量标注、img：影像底图、cia：影像标注
   * ter：地形晕渲、cta：地形标注、eva：矢量英文标注、eia：影像英文标注
   */
  function createTMap(layer: TMapType) {
    // 添加天地图影像注记底图
    const tMapImagery = new WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/${layer}_w/wmts?tk=b20a5cf27754495fb3f572f39a0c0a9c`,
      layer,
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 18,
    });
    return tMapImagery;
    // viewer.imageryLayers.addImageryProvider(tMapImagery)
  }

  watchEffect(() => {
    if (cesiumRef.value) {
      viewer.value = new Viewer(cesiumRef.value, {
        baseLayer: new ImageryLayer(new OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        })),
        shouldAnimate: true,
        infoBox: false,
        // baseLayer: new ImageryLayer(createTMap('img')),
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
      });
      viewer.value.entities.add(entity);
      nextTick(() => {
        viewer.value?.flyTo(entity);
      })
    }
  });
</script>