import { EthvmSocketIoApi, EthvmApolloApi, EthvmMigrationApi } from '@app/core/api'
import { VueEthvmApi } from '@app/core/plugins'
import VueSocketIO from '@app/core/plugins/socketio/'
import router from '@app/core/router'
import store from '@app/core/store'
import App from '@app/modules/App.vue'
import i18n from '@app/translations'
import ApolloClient from 'apollo-boost'
import io from 'socket.io-client'
import VTooltip from 'v-tooltip'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueTimeago from 'vue-timeago'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

/*
  ===================================================================================
    Vue: Plugins Configuration
  ===================================================================================
*/

// -------------------------------------------------------
//    VTooltip
// -------------------------------------------------------

Vue.use(VTooltip)

// -------------------------------------------------------
//    EventHub
// -------------------------------------------------------

Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false

// -------------------------------------------------------
//    APIs: Legacy SocketIO + Apollo (GraphQL)
// -------------------------------------------------------

// Socket

const socket = io(process.env.VUE_APP_API_ENDPOINT)

// Apollo

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_API_2_ENDPOINT
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// Transition api
const ethvmApolloApi = new EthvmApolloApi(apolloClient)
const ethvmSocketIoApi = new EthvmSocketIoApi(socket)
const api = new EthvmMigrationApi(ethvmApolloApi, ethvmSocketIoApi)

// Install
Vue.use(VueSocketIO, socket, store)
Vue.use(VueApollo)
Vue.use(VueEthvmApi, api)

// -------------------------------------------------------
//    TimeAgo
// -------------------------------------------------------

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('date-fns/locale/en')
  }
})

// -------------------------------------------------------
//    Vuetify
// -------------------------------------------------------

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
    bttnToken: '#b4bfd2',
    bttnReport: '#1EEEA6'

    // used -->
    // background: String(colors.grey.darken3)
  }
})

/*
  ===================================================================================
    Vue: Application Kickstart
  ===================================================================================
*/

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  apolloProvider,
  template: '<App/>',
  data: {},
  components: {
    App
  }
})
