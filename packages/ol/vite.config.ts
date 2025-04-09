import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
const __dirname = dirname(fileURLToPath(import.meta.url));
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
      name: 'ol',
      fileName: format => `ol.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['vue', 'naive-ui', /^ol.*/, /^@turf.*/],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          exports: 'named',
          name: 'ol',
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
});
