import { createI18n } from 'vue-i18n'

import en_US from './en_US.json'

const messages = {
    en_US
}

export default createI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    legacy: false,
    messages
})
