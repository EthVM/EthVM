import Vue from 'vue'
import { BehaviorSubject } from 'rxjs'
import { SubscriptionState } from '@app/core/plugins'

declare module 'vue/types/vue' {
  interface Vue {
    $subscriptionState: BehaviorSubject<SubscriptionState>
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
