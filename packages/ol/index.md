# OpenLayers 扩展库

在vue3中对OpenLayers封装的工具库 (组件、组合式函数、常量、工具函数)。

<div class="flex flex-wrap gap-2">

[![npm](https://img.shields.io/npm/v/@summeruse/ol)](https://www.npmjs.com/package/@summeruse/ol)

![NPM Last Update](https://img.shields.io/npm/last-update/%40summeruse%2Fol)

![NPM License](https://img.shields.io/npm/l/%40summeruse%2Fol)

![NPM Downloads](https://img.shields.io/npm/dy/%40summeruse%2Fol)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40summeruse%2Fol)

![NPM Type Definitions](https://img.shields.io/npm/types/%40summeruse%2Fol)

</div>

## 安装

```bash
pnpm i @summeruse/ol ol vue
```

## 使用UMD 模块

::: info 提示

0.4.0 版本开始，提供 UMD 模块，可直接在浏览器中使用。

:::

:::

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/ol@10.7.0/dist/ol.js"></script>
<script src="https://unpkg.com/@summeruse/ol@latest/dist/index.iife.js"></script>
```

你可以在浏览器中直接使用 `window.SummerUse.ol` 访问库中的所有函数和常量。

### 示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/ol@10.7.0/dist/ol.js"></script>
  <script src="./dist/index.iife.min.js"></script>
</head>
<body>
  <div id="app">
    <ol-map style="height: 100vh;width: 100vw;" :ol-map="olMap">
    </ol-map>
  </div>
</body>
<script>
  const SummerUseOl = window.SummerUse.ol
  const app = Vue.createApp({
    components: {
      'ol-map': SummerUseOl.OlMap,
    },
    data() {
      return {
        olMap: null,
      }
    },
    beforeMount() {
      this.olMap = new ol.Map()
      this.olMap.addLayer(SummerUseOl.createOpenStreetMapLayer())
    }

  })
  app.mount('#app')
</script>

</html>
```
