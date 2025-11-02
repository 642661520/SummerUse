---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'SummerUse'
  text: Same As Vue
  tagline: 一些用于 Vue 的工具库
  actions:
    - theme: brand
      text: Guide
      link: /guide
    - theme: alt
      text: View on GitHub
      link: https://github.com/642661520/SummerUse
  image:
    src: /summeruse_logo_256.png
    alt: SummerUse

features:
  - title: '@summeruse/ol'
    link: /ol/
    icon:
      light: https://openlayers.org/theme/img/logo-light.svg
      dark: https://openlayers.org/theme/img/logo-dark.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/ol" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>用于 OpenLayers 的工具库
  - title: '@summeruse/cesium'
    link: /cesium/
    icon:
      src: https://cesium.com/cesium-logomark.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/cesium" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>用于 Cesium 的工具库
  - title: '@summeruse/naive-ui'
    link: /naive-ui/
    icon:
      src: https://naiveui.oss-cn-hongkong.aliyuncs.com/naivelogo.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/naive-ui" style="display:inline-block;vertical-align:middle;margin-right:10px"></img> UI 组件库
  - title: '@summeruse/layer'
    link: /layer/
    # 弹窗 的图标
    icon: 🪟
    details: <img src="https://img.shields.io/npm/v/@summeruse/layer" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>弹窗层组件库
  - title: '@summeruse/turf'
    link: /turf/
    icon:
      src: https://turfjs.org/img/logo.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/turf" style="display:inline-block;vertical-align:middle;margin-right:10px"></img> 用于 turf 的工具库
  - title: '@summeruse/utils'
    icon:
      src: https://nodejs.org/static/logos/jsIconGreen.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/utils" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>一些 node 工具库

---
