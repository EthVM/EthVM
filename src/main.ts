import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './translations'
import Vuex from 'vuex'
import store from './states'
import Toasted from 'vue-toasted'
import VueHighcharts from 'vue-highcharts'
import io from 'socket.io-client';

import socketConfig from '@/configs/socket.json'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'

import '@/components'
Vue.prototype.$eventHub = new Vue();
Vue.config.productionTip = false
Vue.use(Toasted, {
	router
})
Vue.use(VueHighcharts);
Vue.use(VueSocketio, io(socketConfig.url+":"+socketConfig.port), store);
Vue.use(VueTimeago, {
	name: 'timeago',
	locale: 'en-US',
	locales: {
		'en-US': require('vue-timeago/locales/en-US.json')
	}
})
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