import Actions from '@app/modules/blocks/store/actions'
import Getters from '@app/modules/blocks/store/getters'
import Mutations from '@app/modules/blocks/store/mutations'
import State from '@app/modules/blocks/store/state'

import Vuex from 'vuex'

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
})
