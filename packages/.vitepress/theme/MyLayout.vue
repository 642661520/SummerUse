<script setup>
  import DefaultTheme from 'vitepress/theme';
  import NProvider from './components/NProvider.vue';
  const { Layout } = DefaultTheme;
</script>

<template>
  <NProvider>
    <Layout v-bind="$attrs">
      <template v-for="(_, key) in $slots" :key="index" v-slot:[key]="slotProps">
        <slot :name="key" v-bind="slotProps" />
      </template>
    </Layout>
  </NProvider>
</template>