import { EthvmApolloApi } from '@app/core/api'
import { VueEthvmApi } from '@app/core/plugins'
import router from '@app/core/router'
import store from '@app/core/store'
import App from '@app/modules/App.vue'
import i18n from '@app/translations'
import * as Sentry from '@sentry/browser'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import Vuetify from 'vuetify'
import 'vuetify/src/stylus/app.styl'

/*
  ===================================================================================
    Vue: Plugins Configuration
  ===================================================================================
*/

// -------------------------------------------------------
//    EventHub
// -------------------------------------------------------

Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false

// -------------------------------------------------------
//    APIs: Apollo (GraphQL)
// -------------------------------------------------------

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_API_ENDPOINT || ''
})

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_API_SUBSCRIPTIONS_ENDPOINT || '',
  options: {
    reconnect: true
  }
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development'
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

const api = new EthvmApolloApi(apolloClient)

Vue.use(VueApollo)
Vue.use(VueEthvmApi, api)



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
    bttnReport: '#1EEEA6',
    linkBlue: '#3965e8'

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

/*
  ===================================================================================
    Sentry
  ===================================================================================
*/

const sentryToken = process.env.VUE_APP_SENTRY_SECURITY_TOKEN
if (sentryToken) {
  Sentry.init({
    dsn: sentryToken,
    integrations: [new Sentry.Integrations.Vue({ Vue })],
    maxBreadcrumbs: 0
  })
}
