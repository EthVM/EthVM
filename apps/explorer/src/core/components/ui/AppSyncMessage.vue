<template>
  <div v-if="temp">
    <v-layout>
      <v-flex xs12 >
       <v-slide-x-reverse-transition>
        <v-card v-if="!hide" color="sync" flat>
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


        <v-layout v-else align-center justify-end fill-height>

          <!-- <v-tooltip left>
            <template v-slot:activator="{ on }"> -->
              <v-img
                :src="require('@/assets/icon-warning-outline.png')"
                max-width="50px"
                height="50px"
                contain
                @click="hide=false"
                v-on="on"
              />
            <!-- </template>
            <span>{{ $t('btn.details')}}</span>
          </v-tooltip> -->
        </v-layout>
         </v-slide-x-reverse-transition>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { syncStatus, syncStatusUpdates } from '@app/core/components/ui/metadata.graphql'
@Component({
  // data() {
  //   return {
  //     syncing: undefined
  //   }
  // },
  // apollo: {
  //   syncing: {
  //     query: syncStatus,
  //     update({ metadata }) {
  //       const { isSyncing } = metadata
  //       return isSyncing
  //     },
  //     subscribeToMore: {
  //       document: syncStatusUpdates,
  //       updateQuery(previousResult, { subscriptionData }) {
  //         const { isSyncing } = subscriptionData.data
  //         const previousIsSyncing = previousResult.metadata.isSyncing
  //         if (isSyncing != previousIsSyncing) {
  //           // TODO implement this without needing a page reload
  //           window.history.go()
  //         }
  //         return { metadata: { __typename: 'Metadata', isSyncing } }
  //       }
  //     }
  //   }
  // }
})
export default class AppSyncMessage extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  //syncing?: boolean
  temp = true
  hide: boolean = false
  showIcon: boolean = false

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  afterLeave():void {
    this.showIcon = true
  }


  /*
  ===================================================================================
    Computed
  ===================================================================================
  */
  get alertClass(): string {
    return this.hide ? 'alert-small' : 'alert-large'
  }

  get smallAlert(): boolean {
    return this.showIcon && this.hide
  }
}
</script>

<style lang="css">
.alert-large {
  display: flex;
  position: sticky;
  bottom: 0%;
}

.alert {
  position: fixed;
  display: flex;
  bottom: 0%;
  right: 0%;
  width: 100%;
}



.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
