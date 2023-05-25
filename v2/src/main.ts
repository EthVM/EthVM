import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './core/router'
import vuetify from './core/plugins/vuetify'
import 'core-js/features/array/at'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { ApolloClients } from '@vue/apollo-composable'
import clients from './apollo'
import Configs from './configs'
import i18n from './translations'
import { useI18n } from 'vue-i18n'
import './assets/fonts/css/Roboto.css'
import VueGtag from 'vue-gtag-next'

const app = createApp({
    setup() {
        provide(ApolloClients, clients)
        const { t } = useI18n({ useScope: 'global' }) // call useI18n, and spread t from  useI18n returning
        return { t } // return render context that included t
    },
    render: () => h(App)
})

Sentry.init({
    app,
    dsn: Configs.SENTRY,
    integrations: [
        new BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracePropagationTargets: ['localhost', 'ethvm.com', /^\//]
        })
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: Configs.NODE_ENV === 'production' ? 0.2 : 1.0,
    release: Configs.VERSION,
    environment: Configs.NODE_ENV,
    initialScope: {
        tags: { chain: Configs.NETWORK }
    }
})

app.use(router)
    .use(vuetify)
    .use(createPinia())
    .use(i18n)
    .use(
        VueGtag,
        {
            appName: `ethvm.com`,
            pageTrackerScreenviewEnabled: true,
            enabled: true,
            config: {
                id: Configs.GA_ID
            }
        },
        router
    )
    .mount('#app')
