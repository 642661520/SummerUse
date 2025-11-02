import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  typescript: true,
  ignores: ['dist', 'node_modules', '**/*.d.ts', '**/*.setup.ts'],
  rules: {
    // ts-nocheck 忽略类型检查
    '@typescript-eslint/ban-ts-comment': 'off',
  },
})
