import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './index.ts',
  format: ['cjs', 'esm'],
  target: 'node20',
  dts: true,
})
