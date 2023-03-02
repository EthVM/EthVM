import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './core/router'
import vuetify from './core/plugins/vuetify'
import { loadFonts } from './core/plugins/webfontloader'
import 'core-js/features/array/at'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { ApolloClients } from '@vue/apollo-composable'
import clients from './apollo'
import Configs from './configs'
loadFonts()

const app = createApp({
    setup() {
        provide(ApolloClients, clients)
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
    tracesSampleRate: 1.0
})

app.use(router).use(vuetify).use(createPinia()).mount('#app')
