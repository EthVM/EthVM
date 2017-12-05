import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './translations'
import Vuex from 'vuex'
import store from './states'
import Toasted from 'vue-toasted'
import 'vue-awesome/icons'

import Header from '@/components/Header'
import TopNav from '@/components/TopNav'
import HpTxContainer from '@/components/HomePage/TxContainer'
import Footer from '@/components/Footer'

import * as Icon from 'vue-awesome'

Vue.config.productionTip = false
Vue.use(Toasted, {
	router
})
/* eslint-disable no-new */
Vue.component('icon', Icon)
Vue.component('Header', Header)
Vue.component('topnav', TopNav)
Vue.component('hp-tx-container', HpTxContainer)
Vue.component('Footer', Footer)

new Vue({
	el: '#app',
	store,
	router,
	i18n,
	template: '<App/>',
	data: {},
	components: {
		App
	}
})