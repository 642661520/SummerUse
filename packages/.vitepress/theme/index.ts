import type { Theme } from 'vitepress'
import type { AsyncComponentLoader } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'
import MyLayout from './MyLayout.vue'
import 'virtual:uno.css'
import 'ol/ol.css'
import './index.scss'

const requireModules = import.meta.glob('../components/**/*.vue') as Record<
  string,
  AsyncComponentLoader
>

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 把 components 下的所有组件都注册为全局组件
    for (const [path, module] of Object.entries(requireModules)) {
      const initPath = path.replace('/index.vue', '.')
      const name = initPath.slice(initPath.lastIndexOf('/') + 1, initPath.lastIndexOf('.'))
      app.component(name, defineAsyncComponent(module))
    }
  },
} satisfies Theme
