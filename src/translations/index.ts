import VueI18n from 'vue-i18n'
import Vue from 'vue'
import * as en_US from './en_US.json'
import * as ja_JP from './ja_JP.json'

const defaultLocale: string = 'en_US'
const messages: any  = {
	en_US: en_US,
	ja_JP: ja_JP
}

Vue.use(VueI18n)
export default new VueI18n({
	locale: defaultLocale,
	messages,
	fallbackLocale: 'en_US'
})