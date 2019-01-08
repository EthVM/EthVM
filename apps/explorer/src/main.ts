import App from '@app/App.vue'
import { EthvmSocketIoApi, VueEthvmApi } from '@app/api'

import router from '@app/router'
import store from '@app/states'
import i18n from '@app/translations'
import io from 'socket.io-client'
import VTooltip from 'v-tooltip'
import Vue from 'vue'
import InfiniteScroll from 'vue-infinite-scroll'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Vue modules configuration
Vue.use(VTooltip)

Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false

Vue.use(VueSocketio, io(process.env.VUE_APP_API_ENDPOINT), store)
Vue.use(VueEthvmApi, new EthvmSocketIoApi(process.env.VUE_APP_API_ENDPOINT))

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('date-fns/locale/en')
  }
})

Vue.use(InfiniteScroll)

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
    txSuccess: '#40ce9c',
    txFail: '#fe1377',
    txPen: '#eea66b',
    lineGrey: '#efefef',
    tableGrey: '#fbfcfe',
    tabActive: '#3844b8',
    uncleGrey: '#eff1f6'

    // used -->
    // background: String(colors.grey.darken3)
  }
})

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

