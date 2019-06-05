<template>
  <v-card color="sync" v-if="syncing" flat>
    <v-layout row align-center justify-center fill-height>
      <v-card-title class="text-xs-center">{{ $t('message.sync.main') }}</v-card-title>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { syncStatus, syncStatusUpdates } from '@app/core/components/ui/metadata.graphql'
@Component({
  data(){
    return {
      syncing: undefined
    }
  },
  apollo: {
    syncing: {

      query: syncStatus,

      update({ metadata }) {

        return metadata.isSyncing
      },

      subscribeToMore: {
        document: syncStatusUpdates,

        updateQuery(previousResult, { subscriptionData }) {
          const { isSyncing } = subscriptionData.data
          return { metadata: { __typename: 'Metadata', isSyncing }}
        }
      }

    }
  }
})
export default class AppSyncMessage extends Vue {

  syncing?: boolean

}
</script>
