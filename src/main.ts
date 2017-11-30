import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './translations'
import Vuex from 'vuex'
import store from './states'
import Toasted from 'vue-toasted'

import Header from '@/components/Header.vue'
import BlockContainer from '@/components/BlockContainer.vue'

Vue.config.productionTip = false
Vue.use(Toasted, {
	router
})
/* eslint-disable no-new */
Vue.component('Header', Header)
Vue.component('block-container', BlockContainer)
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