import Actions from '@app/store/actions'
import Getters from '@app/store/getters'
import Mutations from '@app/store/mutations'
import { StateImpl } from '@app/store/state'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: StateImpl,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
})
