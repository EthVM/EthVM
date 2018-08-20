import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as en_US from './en_US.json'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US,
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})
