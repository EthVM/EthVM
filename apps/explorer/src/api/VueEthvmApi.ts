import { EthvmApi } from '@app/api'

export const VueEthvmApi = {
  install(Vue: any, api: EthvmApi) {
    Vue.prototype.$api = api
  }
}
