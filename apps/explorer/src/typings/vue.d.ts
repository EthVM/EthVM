import Vue from 'vue'
import { BehaviorSubject } from 'rxjs'
import { SubscriptionState } from '@app/core/plugins'

declare module 'vue/types/vue' {
  interface Vue {
    $eventHub: Vue
    $subscriptionState: BehaviorSubject<SubscriptionState>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $eventHub?: Vue
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
