<template>
  <v-app class="content">
    <the-navigation-drawer />
    <v-content >
      <v-layout column fill-height>
        <app-greeting v-if="appGreet" :greet="appGreet" />
        <app-sync-message  v-if="isSyncing" />
        <v-flex>
          <router-view  :key="$route.path" />
        </v-flex>
        <v-spacer />
        <the-footer />
      </v-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import AppSyncMessage from '@app/core/components/ui/AppSyncMessage.vue'
import AppGreeting from '@app/core/components/ui/AppGreeting.vue'
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import { Events } from '@app/core/hub'
import storePack from 'store'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppGreeting,
    AppSyncMessage,
    TheNavigationDrawer,
    TheFooter
  }
})
export default class App extends Vue {
  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    // Load initial processing status
    // this.$api.getProcessingMetadata('syncing').then(ev => this.$store.commit('NEW_SYNC', ev ? ev.value : true))
    // Preload some previous block metrics
    // TODO re-enable metrics
    // this.$api.getBlockHeaderMetrics(MAX_ITEMS, 0).then(bms => {
    //   this.$store.commit(Events.NEW_BLOCK_METRIC, bms)
    //   this.$eventHub.$emit(Events.NEW_BLOCK_METRIC, bms)
    // })
  }

  /*
  ===================================================================================
    Computed values
  ===================================================================================
  */

  get isSyncing() {
    return this.$store.getters.syncing
  }

  get appGreet() {
    return !storePack.get('notFirstTimeVisit')
  }
}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';

.content {
  background: #f3f4f8;
}
</style>
