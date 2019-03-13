import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en_US from '@app/translations/en_US.json'

const messages = {
  en_US,
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages
})
