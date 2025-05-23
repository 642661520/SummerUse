import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      outDir: 'lib',
    }),
    dts({
      tsconfigPath: './tsconfig.app.json',
      outDir: 'es',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'ui',
      fileName: format => `ui.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['vue', /^naive-ui.*/, /^@summeruse.*/, /^@vueuse.*/],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          exports: 'named',
          dir: './dist',
        },
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: '.',
          dir: './es',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: '.',
          dir: './lib',
        },
      ],
    },
  },
})
