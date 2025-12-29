import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: './index.ts',
  platform: 'browser',
  name: 'SummerUse.ol',
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
  noExternal: ['pmtiles', 'proj4'],
  plugins: [Vue({ isProduction: true })],
  outputOptions: {
    name: 'SummerUse.ol',
    globals: (id) => {
      if (id === 'vue')
        return 'Vue'
      if (id.startsWith('ol/')) {
        return id.replace(/\//g, '.')
      }
      return id
    },
    dir: './dist',
  },
  dts: {
    vue: true,
  },
})
