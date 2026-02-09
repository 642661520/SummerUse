import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: './index.ts',
  platform: 'browser',
  name: 'SummerUse.naive-ui',
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
  plugins: [Vue({ isProduction: true })],
  outputOptions: {
    name: 'SummerUse.naive-ui',
    globals: (id) => {
      if (id === 'vue')
        return 'Vue'
      return id
    },
    dir: './dist',
  },
  dts: {
    vue: true,
  },
})
