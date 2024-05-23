import enUS from './en_US.json'
import ruRU from './ru_RU.json'

const messages = {
    enUS,
    ruRU
}

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'enUS',
    fallbackLocale: 'enUS',
    messages
}))
