import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/display.css'
import esLang from 'element-ui/lib/locale/lang/es'

import '@/styles/index.scss' // global css

import VModal from 'vue-js-modal' // manage Modals components

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// Mapbox
import VueMapboxTs from 'vue-mapbox-ts-legacy'
Vue.use(VueMapboxTs)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: esLang
})

Vue.use(VModal, {
  dynamicDefaults: {
    dialog: true,
    draggable: true,
    resizable: true,
    height: 'auto'
  }
})

import Echo from 'laravel-echo'
window.Pusher = require('pusher-js')

// This assumes you have already saved your bearer token in your browsers local storage

const token = sessionStorage.getItem('token')

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '405e1b516bd8d4e091fc',
  wsHost: 'localhost',
  authEndpoint: process.env.VUE_APP_BASE_API + '/pedidosreload',
  encrypted: true,
  forceTLS: false,
  wsPort: 6001,
  wssPort: 6001,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  auth: {
    headers: {
      authorization: 'Bearer ' + token
    }
  }
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
