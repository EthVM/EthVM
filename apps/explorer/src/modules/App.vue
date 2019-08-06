<template>
  <v-app class="content">
    <the-navigation-drawer />
    <v-content >
      <v-layout column fill-height>
        <app-greeting v-if="appGreet" :greet="appGreet" />
        <!--        <app-connection-message />-->
        <v-flex>
          <router-view :key="$route.path" />
        </v-flex>
        <the-footer />
      </v-layout>
    </v-content>
    <app-sync-message />
  </v-app>
</template>

<script lang="ts">
import AppGreeting from '@app/core/components/ui/AppGreeting.vue'
import AppSyncMessage from '@app/core/components/ui/AppSyncMessage.vue'
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import storePack from 'store'
import { Vue, Component } from 'vue-property-decorator'
import AppConnectionMessage from '@app/core/components/ui/AppConnectionMessage.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppGreeting,
    AppSyncMessage,
    AppConnectionMessage,
    TheNavigationDrawer,
    TheFooter
  }
})
export default class App extends Vue {
  /*
  ===================================================================================
    Computed values
  ===================================================================================
  */
  sheet=true
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
