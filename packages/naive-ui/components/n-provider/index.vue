<script lang="ts" setup>
import type { GlobalThemeOverrides, NDateLocale, NLocale } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider, NModalProvider, NNotificationProvider } from 'naive-ui'

withDefaults(
  defineProps<{
    locale?: NLocale
    dateLocale?: NDateLocale
    theme?: BuiltInGlobalTheme
    themeOverrides?: GlobalThemeOverrides
    globalStyle?: boolean
  }>(),
  {
    globalStyle: true,
  },
)
</script>

<template>
  <NConfigProvider :locale :date-locale :theme :theme-overrides>
    <NGlobalStyle v-if="globalStyle" />
    <NModalProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NDialogProvider>
            <slot />
          </NDialogProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NModalProvider>
  </NConfigProvider>
</template>
