import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'

/* 导入全局样式表 */
import './assets/css/global.css'
import './assets/font_3532176_zdb82a1sxq/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
