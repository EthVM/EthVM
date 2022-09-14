import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './core/router'
import vuetify from './core/plugins/vuetify'
import { loadFonts } from './core/plugins/webfontloader'
loadFonts()

import { ApolloClients } from '@vue/apollo-composable'

import clients from './apollo'

const app = createApp({
    setup() {
        provide(ApolloClients, clients)
    },
    render: () => h(App)
})

app.use(router).use(vuetify).use(createPinia()).mount('#app')
