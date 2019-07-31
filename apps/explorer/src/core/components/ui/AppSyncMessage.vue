<template>
  <v-card v-model="sync" color="sync" flat class="alert-full">
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
        <p class="black--text font-italic ">{{ $t('message.sync.main') }}</p>
      </v-flex>
      <v-flex shrink>
        <v-btn outline color="primary" class="hide-btn text-capitalize">Got It</v-btn>
      </v-flex>
    </v-layout>
  </v-card>
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
  syncing?: boolean
}
</script>

<style lang="css">
.alert-full {
  display: flex;
  position: sticky;
  bottom: 0%;

}
.hide-btn {
  margin: 0px;
}
</style>
