import Vue from 'vue'
import { EthvmApi } from '@app/core/api'

declare module 'vue/types/vue' {
  import { BehaviorSubject } from 'rxjs'
  import { SubscriptionState } from '@app/core/plugins'

  interface Vue {
    $eventHub: Vue
    $api: EthvmApi
    $subscriptionState: BehaviorSubject<SubscriptionState>
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
