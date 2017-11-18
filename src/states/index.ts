import Vue from 'vue'
import Vuex from 'vuex'
import { State } from './state'
import Getters from './getters'
import Mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
	state: State,
	mutations: Mutations,
	getters: Getters
})