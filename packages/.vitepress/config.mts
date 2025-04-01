import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SummerUse',
  description: 'A VitePress Site',
  base: '/SummerUse/',
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns'],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'ol',
        items: [
          { text: 'components', link: '/ol/components' },
          { text: 'composables', link: '/ol/composables' },
          { text: 'constants', link: '/ol/constants' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'ol',
        items: [
          {
            text: 'components',
            items: [{ text: 'n-ol-contextmenu', link: '/ol/components/n-ol-contextmenu' }],
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
