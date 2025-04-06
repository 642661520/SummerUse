import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
import { repository } from '../../package.json';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SummerUse',
  description: '自用的前端工具库',
  base: '/SummerUse/',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/SummerUse/favicon.ico' }],
    ['meta', { name: 'author', content: 'Summer' }],
    ['meta', { name: 'keywords', content: '前端, 地图, 工具库' }],
  ],
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns'],
    },
  },
  themeConfig: {
    logo: '/SummerUse/summeruse_logo_256.png',
    search: {
      provider: 'local',
    },
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/642661520/SummerUse/blob/main/packages/:path',
    },
    outline: {
      label: '当前页',
    },
    socialLinks: [{ icon: 'github', link: repository }],
    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2023-present Summer',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    lastUpdated: {
      text: '更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
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
          { text: 'utils', link: '/ol/utils/' },
          { text: 'constants', link: '/ol/constants/' },
          { text: 'Changelog', link: '/ol/CHANGELOG' },
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
                { text: 'useDrawLineString', link: '/ol/composables/useDrawLineString/' },
                { text: 'useDrawPolygon', link: '/ol/composables/useDrawPolygon/' },
              ],
            },
            {
              text: '工具函数',
              link: '/ol/utils/',
              items: [
                { text: '图层', link: '/ol/utils/layer/' },
                { text: '地理圆形', link: '/ol/utils/realCircle/' },
              ],
            },
            {
              text: '常量',
              link: '/ol/constants/',
            },
            { text: '更新日志', link: '/ol/CHANGELOG' },
          ],
        },
      ],
    },
  },
});
