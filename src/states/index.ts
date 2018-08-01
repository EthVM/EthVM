import Vue from 'vue'
import Vuex from 'vuex'
import Actions from '@/states/actions'
import Getters from '@/states/getters'
import Mutations from '@/states/mutations'
import State from '@/states/state'

Vue.use(Vuex)

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
})
