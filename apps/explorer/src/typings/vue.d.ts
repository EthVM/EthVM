import Vue from 'vue'
import { EthvmApi } from '@app/core/api'

import {NormalizedCacheObject} from "apollo-cache-inmemory";
import {ApolloClient} from "apollo-client";


declare module 'vue/types/vue' {

  interface Vue {
    $eventHub: Vue
    $api: EthvmApi
  }
}

declare module 'vue/types/options' {

  interface ComponentOptions<V extends Vue> {
    $eventHub?: Vue
    $api?: EthvmApi
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
