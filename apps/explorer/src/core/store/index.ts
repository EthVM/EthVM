import Getters from '@app/core/store/getters'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: Getters,
  strict: false
})
