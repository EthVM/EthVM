import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en_US from '@app/translations/en_US.json'
import ru_RU from '@app/translations/ru_RU.json'
import es_ES from '@app/translations/es_ES.json'

const messages = {
  en_US,
  ru_RU
}
const dateTimeFormats = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    }
  },
  'ru-RU': {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    },
    long: {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }
  }
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages,
  dateTimeFormats
})
