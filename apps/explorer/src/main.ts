import { EthvmSocketIoApi } from '@app/core/api'
import { VueEthvmApi } from '@app/core/plugins'
import router from '@app/core/router'
import store from '@app/core/store'
import App from '@app/modules/App.vue'
import i18n from '@app/translations'
import axios from 'axios'
import io from 'socket.io-client'
import VTooltip from 'v-tooltip'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueSocketIO from 'vue-socket.io'
import VueTimeago from 'vue-timeago'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Vue modules configuration
Vue.use(VTooltip)

Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false

const socket = io(process.env.VUE_APP_API_ENDPOINT)
Vue.use(VueSocketIO, socket, store)
Vue.use(VueEthvmApi, new EthvmSocketIoApi(socket))

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('date-fns/locale/en')
  }
})

Vue.use(Vuetify, {
  theme: {
    // used -->
    primary: '#3d55a5',
    secondary: '#6270fc',
    accent: '#4a67c6',
    success: '#92cce1',
    warning: '#fed9a1',
    error: '#fe8778',
    info: '#8391a8',
    nav: '#a0a8fd',
    txSuccess: '#00b173',
    txFail: '#fe1377',
    txPen: '#eea66b',
    lineGrey: '#efefef',
    tableGrey: '#fbfcfe',
    tabActive: '#3844b8',
    uncleGrey: '#eff1f6',
    sync: '#ffe7d6',
    bttnGrey: '#dee5f0',
    bttnToken: '#b4bfd2'


    // used -->
    // background: String(colors.grey.darken3)
  }
})

// See: https://www.npmjs.com/package/vue-axios //
Vue.use(VueAxios, axios)

const v = new Vue({
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
