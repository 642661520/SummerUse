import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  typescript: true,
  ignores: ['dist', 'node_modules', '**/*.d.ts'],
})
