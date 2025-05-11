import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  target: 'node20',
  dts: true,
  sourcemap: false,
  define: {
    __DEV__: 'false',
  },
  shims: true,
  external: [],
  // unused: { level: 'error' },
})
