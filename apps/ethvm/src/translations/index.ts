import en_US from '@app/translations/en_US.json'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})
