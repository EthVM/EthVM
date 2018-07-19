import Vue from 'vue'
import Vuex from 'vuex'
import Actions from './actions'
import Getters from './getters'
import Mutations from './mutations'
import State from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
})
