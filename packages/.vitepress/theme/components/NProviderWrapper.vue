<script setup lang="ts">
import { NProvider } from '@summeruse/ui'
import { darkTheme, lightTheme } from 'naive-ui'
import { useData } from 'vitepress'
import { computed } from 'vue'

defineOptions({
  name: 'NProvider',
})
const { isDark } = useData()

const theme = computed(() => {
  return isDark.value ? darkTheme : lightTheme
})

const themeOverrides = computed(() => {
  return isDark.value
    ? {
        common: {
          primaryColor: '#3e63dd',
          primaryColorHover: '#5c73e7',
          primaryColorPressed: '#a8b1ff',
          primaryColorSuppl: '#4d4dff',
        },
      }
    : {
        common: {
          primaryColor: '#5672cd',
          primaryColorHover: '#3a5ccc',
          primaryColorPressed: '#3451b2',
          primaryColorSuppl: '#4d4dff',
        },
      }
})
</script>

<template>
  <NProvider :theme :theme-overrides>
    <slot />
  </NProvider>
</template>
