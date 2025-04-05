import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SummerUse',
  description: '自用的前端工具库',
  base: '/SummerUse/',
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns'],
    },
  },
  themeConfig: {
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'ol',
        items: [
          { text: 'components', link: '/ol/components/' },
          { text: 'composables', link: '/ol/composables/' },
          { text: 'constants', link: '/ol/constants/' },
          { text: '更新日志', link: '/ol/CHANGELOG' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            {
              text: '入门',
              link: '/guide/',
            },
          ],
        },
        {
          text: 'packages',
          items: [
            {
              text: 'ol',
              link: '/ol/',
            },
          ],
        },
      ],
      '/ol/': [
        {
          text: 'ol',
          link: '/ol/',
          items: [
            {
              text: '组件',
              link: '/ol/components/',
              items: [
                { text: 'ol-map', link: '/ol/components/ol-map/' },
                { text: 'n-ol-contextmenu', link: '/ol/components/n-ol-contextmenu/' },
                { text: 'n-ol-pointermove', link: '/ol/components/n-ol-pointermove/' },
              ],
            },
            {
              text: '组合式函数',
              link: '/ol/composables/',
              items: [
                { text: 'useGraticule', link: '/ol/composables/useGraticule/' },
                { text: 'useSwitchBaseLayer', link: '/ol/composables/useSwitchBaseLayer/' },
              ],
            },
            {
              text: '常量',
              link: '/ol/constants/',
            },
            {
              text: '工具函数',
              link: '/ol/utils/',
            },
            { text: '更新日志', link: '/ol/CHANGELOG' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
