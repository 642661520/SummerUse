import postcss from 'rollup-plugin-postcss'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: './index.ts',
  platform: 'browser',
  name: 'SummerUse.layer',
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
  // @vueuse/core is in dependencies, so it might be bundled by default if not excluded?
  // tsdown/rolldown typically excludes dependencies in 'node' platform, but for 'browser' it might bundle?
  // Let's rely on default exclusion or explicit external if needed.
  // But wait, package.json says @vueuse/core is a dependency.
  // In library mode, we usually want to exclude dependencies.
  // packages/ol uses noExternal for specific deps.
  plugins: [Vue({ isProduction: true }), postcss({
    // preprocessor: sass,
    // extract: true, // 提取为单独的 CSS 文件
    minimize: true,
  })],
  outputOptions: {
    name: 'SummerUse.layer',
    globals: (id) => {
      if (id === 'vue')
        return 'Vue'
      if (id === '@vueuse/core')
        return 'VueUse'
      return id
    },
    dir: './dist',
  },
  dts: {
    vue: true,
  },
})
