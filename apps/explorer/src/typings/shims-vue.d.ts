import Vue from 'vue'
import { EthvmApi } from '@app/api'

declare module 'vue/types/vue' {
  interface Vue {
    $socket: any
    $eventHub: any
    $api: EthvmApi
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $socket?: any
    $eventHub?: any
    $api?: EthvmApi
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
