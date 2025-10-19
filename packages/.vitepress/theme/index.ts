import type { Theme } from 'vitepress'
import type { AsyncComponentLoader } from 'vue'
import ElementPlus from 'element-plus'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'
import MyLayout from './MyLayout.vue'
import 'virtual:uno.css'
import 'ol/ol.css'
import './index.scss'
import 'element-plus/dist/index.css'

const requireModules = import.meta.glob('../components/**/*.vue') as Record<string, AsyncComponentLoader>

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    // 把 components 下的所有组件都注册为全局组件
    for (const [path, module] of Object.entries(requireModules)) {
      const initPath = path.replace('/index.vue', '.')
      const name = initPath.slice(initPath.lastIndexOf('/') + 1, initPath.lastIndexOf('.'))
      const componentName
        = name.split('-').map((item) => {
          return item[0].toUpperCase() + item.slice(1)
        }).join('')
      app.component(componentName, defineAsyncComponent(module))
    }
  },
} satisfies Theme
