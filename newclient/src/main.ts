/* Apolo:  */
import VueApollo from 'vue-apollo'
import { apolloProvider } from './apollo/apolloProvider'
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
import VueMatomo from 'vue-matomo'
import { MatomoConfigs } from '@app/core/configs/matomo-configs'

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

Vue.use(VueApollo)
/*
  ===================================================================================
    Matomo
  ===================================================================================
*/
Vue.use(VueMatomo, MatomoConfigs)

/*
  ===================================================================================
    Vuetify
  ===================================================================================
*/

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
