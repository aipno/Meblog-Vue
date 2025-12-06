// 引入样式文件
import '@/assets/main.css'
import 'nprogress/nprogress.css'
// 导入 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'animate.css'
// 引入全局状态管理
import pinia from "@/stores/index.js";
// 引入 creatApp 方法
import {createApp} from 'vue'
// 引入 App.vue 组件
import App from '@/App.vue'
// 导入路由
import router from '@/router'
// 导入路由守卫
import '@/permission.js'
// 图片点击放大
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'


const app = createApp(App)
// 应用路由
app.use(router)
// 应用 Pinia
app.use(pinia)

app.use(VueViewer)
// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 创建 Vue 应用程序并挂载到 #app 元素上
app.mount('#app')
