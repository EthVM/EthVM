import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en_US from '@/translations/en_US.json'
import ja_JP from '@/translations/ja_JP.json'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US,
  ja_JP
}

Vue.use(VueI18n)
export default new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})
