<template>
  <v-card color="sync" flat v-if="displayMessage">
    <v-layout row align-center justify-center fill-height>
      <v-card-title class="text-xs-center">{{ $t('message.disconnected') }}</v-card-title>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Subscription } from 'rxjs'
  import { SubscriptionState } from '@app/core/plugins'

  @Component
  export default class AppConnectionMessage extends Vue {

    state: SubscriptionState = 'connecting'

    connectedSubscription?: Subscription

    private readonly connectedStates: Set<SubscriptionState> = new Set(['connected', 'reconnected'] as SubscriptionState[])

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    created() {

      this.connectedSubscription = this.$subscriptionState
        .subscribe(async state => {
          console.log('State update', state)
          this.state = state
        })

    }

    destroyed() {
      if (this.connectedSubscription) {
        this.connectedSubscription.unsubscribe()
      }
    }

    get displayMessage(): boolean {
      console.log('Display message', !this.connectedStates.has(this.state))
      return !this.connectedStates.has(this.state)
    }

  }
</script>
