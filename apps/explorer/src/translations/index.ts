import en_US from '@app/translations/en_US.json'
import es_ES from '@app/translations/es_ES.json'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

const defaultLocale = 'en_US'
const messages = {
  en_US,
  es_ES
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})
