<template>
  <v-app class="content">
    <the-navigation-drawer />
    <v-content>
      <v-layout column fill-height>
        <app-greeting v-if="appGreet" :greet="appGreet" />
        <v-flex>
          <router-view :key="$route.path" />
        </v-flex>
        <the-footer />
        <app-message :connected="connected" :syncing="syncing" />
      </v-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import AppGreeting from '@app/core/components/ui/AppGreeting.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import storePack from 'store'
import { Vue, Component } from 'vue-property-decorator'
import { syncStatus, syncStatusUpdates } from '@app/core/components/ui/metadata.graphql'
import { Subscription } from 'rxjs'
import { SubscriptionState } from '@app/core/plugins'

const MAX_ITEMS = 10

@Component({
  components: {
    AppGreeting,
    AppMessage,
    TheNavigationDrawer,
    TheFooter
  },
  data() {
    return {
      syncing: undefined
    }
  },
  apollo: {
    syncing: {
      query: syncStatus,
      update({ metadata }) {
        const { isSyncing } = metadata
        return isSyncing
      },
      subscribeToMore: {
        document: syncStatusUpdates,
        updateQuery(previousResult, { subscriptionData }) {
          const { isSyncing } = subscriptionData.data
          const previousIsSyncing = previousResult.metadata.isSyncing
          if (isSyncing != previousIsSyncing) {
            // TODO implement this without needing a page reload
            window.history.go()
          }
          return { metadata: { __typename: 'Metadata', isSyncing } }
        }
      }
    }
  }
})
export default class App extends Vue {

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  state: SubscriptionState = 'connecting'
  connectedSubscription?: Subscription
  private readonly connectedStates: Set<SubscriptionState> = new Set(['connected', 'reconnected'] as SubscriptionState[])

  syncing?: boolean


  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.connectedSubscription = this.$subscriptionState.subscribe(async state => {
      this.state = state
    })
  }

  destroyed() {
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe()
    }
  }


  /*
  ===================================================================================
    Computed values
  ===================================================================================
  */
  get appGreet() {
    return !storePack.get('notFirstTimeVisit')
  }
  get connected(): boolean {
    return !this.connectedStates.has(this.state)
  }


}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';

.content {
  background: #f3f4f8;
}
</style>
