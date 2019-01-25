import Vue from 'vue'
import { EthvmApi } from '@app/core/api'
import io from 'socket.io-client'

declare module 'vue/types/vue' {
  interface Vue {
    $socket: SocketIOClient.Socket
    $eventHub: Vue
    $api: EthvmApi
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $socket?: SocketIOClient.Socket
    $eventHub?: Vue
    $api?: EthvmApi
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
