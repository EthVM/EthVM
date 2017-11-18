import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './states'

Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
	el: '#app',
	store,
	router,
	template: '<App/>',
	components: {
		App
	}
})