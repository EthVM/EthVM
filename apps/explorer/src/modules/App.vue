<template>
  <v-app style="background: #f3f4f8;">
    <the-navigation-drawer />
    <v-content>
      <app-sync-message v-if="isSyncing" />
      <router-view :key="$route.path" />
      <the-footer />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import AppSyncMessage from '@app/core/components/ui/AppSyncMessage.vue'
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import 'vuetify/dist/vuetify.min.css'

const MAX_ITEMS = 10

@Component({
  components: {
    AppSyncMessage,
    TheNavigationDrawer,
    TheFooter
  }
})
export default class App extends Vue {

  // Lifecyle
  created() {
    // Load initial processing status
    this.$api.getProcessingMetadata('syncing').then(ev =>
      this.$store.commit("NEW_SYNC",  ev ? ev.value : true))

    // Preload some previous block metrics
    this.$api.getBlockMetrics(MAX_ITEMS, 0).then(bms => {
      this.$store.commit(Events.NEW_BLOCK_METRIC, bms)
      this.$eventHub.$emit(Events.NEW_BLOCK_METRIC, bms)
    })
  }

  // Computed
  get isSyncing() {
    console.log(this.$store.getters.syncing)
    return this.$store.getters.syncing
  }
}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';
</style>
