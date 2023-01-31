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

// SweetAlert 2
window.Swal = require('sweetalert2')

// element-io config
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

// This assumes you have already saved your bearer token in your browsers local storage

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
