# OpenLayers 扩展库

在vue3中对OpenLayers封装的工具库 (组件、组合式函数、常量、工具函数)。

<div class="flex flex-wrap gap-2">

<!-- ![NPM Version (with dist tag)](https://img.shields.io/npm/v/%40summeruse%2Fol/beta) -->

[![npm](https://img.shields.io/npm/v/@summeruse/ol)](https://www.npmjs.com/package/@summeruse/ol)

![NPM Last Update](https://img.shields.io/npm/last-update/%40summeruse%2Fol)

![NPM License](https://img.shields.io/npm/l/%40summeruse%2Fol)

![NPM Downloads](https://img.shields.io/npm/dy/%40summeruse%2Fol)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40summeruse%2Fol)

![NPM Type Definitions](https://img.shields.io/npm/types/%40summeruse%2Fol)

![NPM (prod) Dependency Version](https://img.shields.io/npm/dependency-version/%40summeruse%2Fol/vue)

</div>

## 安装

```bash
pnpm i @summeruse/ol ol vue
```

::: tip 依赖

[![vue@3](https://img.shields.io/badge/peerDependencies-vue-blue)](https://cn.vuejs.org/)

[![ol@10](https://img.shields.io/badge/peerDependencies-ol-blue)](https://openlayers.org/)

:::

## 使用UMD 模块

::: warning 警告

0.4.0 版本开始，提供 UMD 模块，可直接在浏览器中使用。

:::

:::

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/ol@10.7.0/dist/ol.js"></script>
<script src="https://unpkg.com/@summeruse/ol@latest/dist/index.iife.js"></script>
```

你可以在浏览器中直接使用 `window.SummerUse.ol` 访问库中的所有函数和常量。
