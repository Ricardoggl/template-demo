import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon图标
import '@/permission' // 权限控制

/**
 * 如果你不想使用 mock-server
 * 你想将 MockJs 用于 api
 * 你可以执行: mockXHR()
 *
 * 目前 MockJs 用于 production 环境,
 * 请删除它，再用于线上  ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {
    mockXHR
  } = require('../mock')
  mockXHR()
}

// set ElementUI lang to zh-CN
Vue.use(ElementUI, {
  locale,
  size: 'small'
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
