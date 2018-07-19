import io from 'socket.io-client'
import Vue from 'vue'
import Toasted from 'vue-toasted'
import App from './App.vue'
import router from './router'
import store from './states'
import i18n from './translations'

import socketConfig from '@/configs/socket.json'
import infiniteScroll from 'vue-infinite-scroll'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'

import VTooltip from 'v-tooltip'

import '@/components'

Vue.use(VTooltip)
Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false
Vue.use(Toasted, {
  router
})
Vue.use(VueSocketio, io(socketConfig.url + ':' + socketConfig.port), store)
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})
Vue.use(infiniteScroll)
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  data: {},
  components: {
    App
  }
})
