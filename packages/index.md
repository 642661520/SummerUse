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
    icon:
      light: https://openlayers.org/theme/img/logo-light.svg
      dark: https://openlayers.org/theme/img/logo-dark.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/ol" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>用于 OpenLayers 的工具库
    link: /ol/
  - title: '@summeruse/cesium'
    icon:
      src: https://cesium.com/cesium-logomark.svg
    details: <img src="https://img.shields.io/npm/v/@summeruse/cesium" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>用于 Cesium 的工具库
    link: /cesium/
  - title: '@summeruse/common'
    icon: 📦
    details: <img src="https://img.shields.io/npm/v/@summeruse/common" style="display:inline-block;vertical-align:middle;margin-right:10px"></img>一些通用的工具库
---
