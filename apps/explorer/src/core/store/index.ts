import Actions from '@app/core/store/actions'
import Getters from '@app/core/store/getters'
import Mutations from '@app/core/store/mutations'
import { StateImpl } from '@app/core/store/state'

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
