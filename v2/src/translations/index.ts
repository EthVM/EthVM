import { createI18n } from 'vue-i18n'

import en_US from './en_US.json'
import ru_RU from './ru_RU.json'
import vi_VN from './vi_VN.json'
import { MassagesShema } from './helpers'

const messages: MassagesShema = {
    en_US,
    ru_RU,
    vi_VN
}

const instance = createI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    legacy: false,
    messages
})

export default instance

export const i18nGlobal = instance.global
