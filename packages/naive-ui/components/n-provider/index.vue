<script lang="ts" setup>
import type { GlobalThemeOverrides, NDateLocale, NLocale } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { NConfigProvider, NDialogProvider, NGlobalStyle, NLoadingBarProvider, NMessageProvider, NModalProvider, NNotificationProvider } from 'naive-ui'

defineOptions({
  name: 'NProvider',
})

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
      <NLoadingBarProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <NDialogProvider>
              <slot />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NLoadingBarProvider>
    </NModalProvider>
  </NConfigProvider>
</template>
