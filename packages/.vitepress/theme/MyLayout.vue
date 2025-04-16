<script setup>
import DefaultTheme from 'vitepress/theme'
import NProviderWrapper from './components/NProviderWrapper.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <NProviderWrapper>
    <Layout v-bind="$attrs">
      <template v-for="(_, key) in $slots" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps" />
      </template>
    </Layout>
  </NProviderWrapper>
</template>
