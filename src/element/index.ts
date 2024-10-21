import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElLoading, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

export default {
  install(app: App<Element>) {
    // app.use(ElementPlus, { size: `default` })
    app.config.globalProperties.$loading = ElLoading.service
    app.config.globalProperties.$message = ElMessage

    // import('@element-plus/icons-vue').then(ElementPlusIconsVue => {
    //   for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    //     app.component(`ElIcon${key}`, component)
    //   }
    // })

    // const ElementPlusIconsVue = import('@element-plus/icons-vue')
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(`ElIcon${key}`, component)
    }
  },
}
