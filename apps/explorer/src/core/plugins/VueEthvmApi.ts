import { EthvmApi } from '@app/core/api'

export const VueEthvmApi = {
  install(Vue: any, api: EthvmApi) {
    Vue.prototype.$api = api
  }
}
