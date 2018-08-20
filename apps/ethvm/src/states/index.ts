import Actions from '@app/states/actions'
import Getters from '@app/states/getters'
import Mutations from '@app/states/mutations'
import State from '@app/states/state'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
})
