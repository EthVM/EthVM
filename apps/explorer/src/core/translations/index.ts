import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en_US from '@app/core/translations/en_US.json'
import es_ES from '@app/core/translations/es_ES.json'

const messages = {
  en_US,
  es_ES
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages
})
