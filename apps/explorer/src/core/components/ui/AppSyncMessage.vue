<template>
  <div v-if="sync" :class="alertClass">
    <v-layout>
      <v-flex xs12 v-if="!hide">
        <v-card color="sync" flat>
          <v-layout row wrap class="pl-4 pr-4 pt-3 pb-3" align-center justify-center>
            <v-flex shrink pl-2 pr-2>
              <v-img
                :src="require('@/assets/icon-warning.png')"
                width="30px"
                height="30px"
                contain
              />
            </v-flex>
            <v-flex grow>
              <p class="black--text font-italic">{{ $t('message.sync.main') }}</p>
            </v-flex>
            <v-flex shrink>
              <v-btn outline color="primary" class="text-capitalize" @click="hide=true">Got It</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-else xs12>
        <v-layout row align-center justify-end fill-height>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-img
                :src="require('@/assets/icon-warning-outline.png')"
                width="50px"
                height="50px"
                contain
                @click="hide=false"
                v-on="on"
              />
            </template>
            <span>{{ $t('btn.details')}}</span>
          </v-tooltip>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { syncStatus, syncStatusUpdates } from '@app/core/components/ui/metadata.graphql'
@Component({
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
export default class AppSyncMessage extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  syncing?: boolean
  hide: boolean = false

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */
  get alertClass(): string {
    return this.hide ? 'alert-small' : 'alert-large'
  }
}
</script>

<style lang="css">
.alert-large {
  display: flex;
  position: sticky;
  bottom: 0%;
}

.alert-small {
  position: fixed;
  bottom: 2%;
  right: 0%;
}
</style>
