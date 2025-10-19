import { generateNavFromPackages, generateSidebarFromPackages } from '@summeruse/utils'
import UnoCSS from 'unocss/vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { defineConfig } from 'vitepress'
import { repository } from '../../package.json'
// https://vitepress.dev/reference/site-config

const nav_sidebar_config = {
  unifiedOrder: {
    // 一级
    guide: 0,
    ol: 1,
    cesium: 2,
    ui: 3,
    common: 4,
    // 二级
    components: 10,
    composables: 11,
    utils: 12,
    constants: 13,

    CHANGELOG: 999,

  },
  exclude: ['**/README.md'],
  alias: {
    CHANGELOG: '更新日志',
    guide: '指南',
  },
}

export default defineConfig({
  title: 'SummerUse',
  description: '自用的前端工具库',
  base: '/SummerUse/',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/SummerUse/favicon.ico' }],
    ['meta', { name: 'author', content: 'Summer' }],
    ['meta', { name: 'keywords', content: '前端, 地图, 工具库' }],
    [
      'script',
      {
        src: 'https://unpkg.com/cesium@1.128.0/Build/Cesium/Cesium.js',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/cesium@1.128.0/Build/Cesium/Widgets/widgets.css',
      },
    ],
    ['script', {}, 'window.CESIUM_BASE_URL = "https://unpkg.com/cesium@1.128.0/Build/Cesium"'],
  ],
  vite: {
    plugins: [
      UnoCSS(),
      viteExternalsPlugin({
        cesium: 'Cesium',
      }),
    ],
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns'],
    },
  },
  themeConfig: {
    logo: '/summeruse_logo_256.png',
    search: {
      provider: 'local',
    },
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/642661520/SummerUse/blob/main/packages/:path',
    },
    outline: {
      label: '当前页',
      level: 'deep',
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
    nav: generateNavFromPackages({
      ...nav_sidebar_config,
    }),
    sidebar: generateSidebarFromPackages({
      ...nav_sidebar_config,
    }),
  },
})
