import { createI18n } from 'vue-i18n'

import en_US from './en_US.json'
import ru_RU from './ru_RU.json'
const messages = {
    en_US,
    ru_RU
}

export default createI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    legacy: false,
    messages
})
