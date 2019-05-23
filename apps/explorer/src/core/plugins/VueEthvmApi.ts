import { SubscriptionClient } from 'subscriptions-transport-ws'
import { BehaviorSubject } from 'rxjs'

interface VueEthvmApiOptions {
  subscriptionClient: SubscriptionClient
}

export type SubscriptionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'reconnected'

export const VueEthvmApi = {
  install(Vue: any, options: VueEthvmApiOptions) {
    const { subscriptionClient } = options

    // install subscription state
    const $subscriptionState = new BehaviorSubject<SubscriptionState>('connecting')

    subscriptionClient.onConnecting(() => $subscriptionState.next('connecting'))
    subscriptionClient.onConnected(() => $subscriptionState.next('connected'))
    subscriptionClient.onDisconnected(() => $subscriptionState.next('disconnected'))
    subscriptionClient.onReconnecting(() => $subscriptionState.next('reconnecting'))
    subscriptionClient.onReconnected(() => $subscriptionState.next('reconnected'))

    Vue.prototype.$subscriptionState = $subscriptionState
  }
}
