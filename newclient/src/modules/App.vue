<template>
    <v-app class="content">
        <the-navigation-drawer />
        <v-content>
            <v-layout column fill-height>
                <app-greeting />
                <app-tracking-consent />
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
import AppTrackingConsent from '@app/core/components/ui/AppTrackingConsent.vue'
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import storePack from 'store'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
    components: {
        AppGreeting,
        AppMessage,
        AppTrackingConsent,
        TheNavigationDrawer,
        TheFooter
    }
})
export default class App extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    syncing?: boolean = false

    /*
  ===================================================================================
    Computed values
  ===================================================================================
  */

    get connected(): boolean {
        return true
    }
}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';

.content {
    background: #f3f4f8;
}
</style>
