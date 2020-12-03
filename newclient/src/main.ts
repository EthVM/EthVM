/* Apolo:  */
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { onError } from 'apollo-link-error'
import { OpenSeaClient } from './apollo/opensea/osClient'
import { FavAddrClient } from './apollo/favorite-addresses/favAddrClient'
import { FavTokClient } from './apollo/favorite-tokens/favTokenClient'
/* Other */
import Vuetify from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css'
import '@app/assets/fonts/google-fonts.css'
import 'vuetify/dist/vuetify.min.css'
import configs from './configs'
import router from '@app/core/router'
import App from '@app/modules/App.vue'
import i18n from '@app/translations'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import Vue from 'vue'
import toChecksum from '@app/core/filters/toChecksum'
import { isAPIExceptionProduction, isAPIExceptionDev } from './apollo/exceptions/errorExceptions'

router.onError(error => {
    if (/loading chunk \d* failed./i.test(error.message)) {
        window.location.reload()
    }
})

/*
  ===================================================================================
    Vue: Plugins Configuration
  ===================================================================================
*/
Vue.config.productionTip = false

/*
  ===================================================================================
    APIs: Apollo (GraphQL)
  ===================================================================================
*/

const httpLink = new HttpLink({
    uri: configs.APOLLO_HTTP
})

const subscriptionClient = new SubscriptionClient(configs.APOLLO_WS, { lazy: true, reconnect: true }, null, [])

const wsLink = new WebSocketLink(subscriptionClient)

const onErrorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
            const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            //For production and staging emit to Sentry:
            if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
                if (!isAPIExceptionProduction(message)) {
                    Sentry.captureException(newError)
                }
            } else {
                //For Development use only console errors:
                if (!isAPIExceptionDev(message)) {
                    console.log(newError)
                }
            }
        })
    }
})
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    onErrorLink.concat(httpLink)
)

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: configs.NODE_ENV === 'development'
    // resolvers
})

const apolloProvider = new VueApollo({
    clients: {
        apolloClient,
        OpenSeaClient,
        FavAddrClient,
        FavTokClient
    },
    defaultClient: apolloClient
})

Vue.use(VueApollo)

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
        bttnToken: '#303030',
        bttnReport: '#1EEEA6',
        linkBlue: '#3965e8',
        primaryLight: '#465a9c',
        errorLight: '#fe7665',
        warningLight: '#fed18e',
        successLight: '#97c9dc',
        menuDark: '#2a3643',
        greyPlaceholder: '#afafaf'

        // used -->
        // background: String(colors.grey.darken3)
    },
    // iconfont: 'fa', // use font awesome icons,
    icons: {
        iconfont: 'fa',
        expand: 'fas fa-chevron-down small-global-icon-font',
        dropdown: 'fas fa-angle-down small-global-icon-font',
        close: 'fas fa-times small-global-icon-font',
        clear: 'fas fa-times'
    }
})

/*
  ===================================================================================
    Vue: Filters
  ===================================================================================
*/

Vue.filter('toChecksum', toChecksum)

/*
  ===================================================================================
    Vue: Application Kickstart
  ===================================================================================
*/

new Vue({
    el: '#app',
    router,
    i18n,
    apolloProvider,
    components: {
        App
    },
    data: {},
    template: '<App/>'
})

/*
  ===================================================================================
    Sentry
  ===================================================================================
*/
const sentryToken = process.env.VUE_APP_SENTRY_SECURITY_DSN

Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: sentryToken,
    integrations: [new VueIntegration({ Vue, attachProps: true, logErrors: true })],
    beforeSend(event) {
        return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? event : null
    },
    release: configs.VERSION
})
