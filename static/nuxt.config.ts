// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
    /**
     * .ENV
     */
    runtimeConfig: {
        // Keys within public are also exposed client-side
        public: {
            ethVMVersion: '2.1.9'
        }
    },
    devtools: { enabled: true },
    build: {
        transpile: ['vuetify']
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', config => {
                // @ts-expect-error
                // temp disable style loading due to VUETIFY BUG https://github.com/vuetifyjs/vuetify-loader/pull/313
                // config.plugins.push(vuetify({ autoImport: true, styles: { configFile: './styles/settings.scss' } }))
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },
        [
            '@nuxtjs/eslint-module',
            {
                /* module options */
            }
        ],
        [
            '@nuxtjs/i18n',
            {
                /* module options */
                locales: [
                    { code: 'en-US', iso: 'enUS', file: 'translations/en_US.json' },
                    { code: 'ru-RU', iso: 'ruRU', file: 'translations/ru_RU.json' }
                ]
            }
        ]
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls
            }
        }
    }
})
