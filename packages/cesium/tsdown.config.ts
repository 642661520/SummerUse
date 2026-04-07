import postcss from 'rollup-plugin-postcss'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: './index.ts',
  platform: 'browser',
  name: 'SummerUse.cesium',
  format: {
    iife: {
      minify: true,
      outExtensions: () => ({
        js: '.min.js',
      }),
    },
    es: {
      minify: false,
    },
  },
  plugins: [Vue({ isProduction: true }), postcss({
    minimize: true,
  })],
  outputOptions: {
    name: 'SummerUse.cesium',
    globals: (id) => {
      if (id === 'vue')
        return 'Vue'
      if (id === 'naive-ui')
        return 'NaiveUI'
      if (id.startsWith('cesium'))
        return 'Cesium'
      return id
    },
    dir: './dist',
  },
  dts: {
    vue: true,
  },
})
