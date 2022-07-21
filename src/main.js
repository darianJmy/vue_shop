import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'

/* 导入全局样式表 */
import './assets/css/global.css'
import './assets/font_3532176_dcof8ycb9rv/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
