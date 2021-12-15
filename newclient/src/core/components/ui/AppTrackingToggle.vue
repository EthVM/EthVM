<template>
    <v-switch
        v-if="!loadingUserConsent"
        :input-value="userConsent"
        color="secondary"
        :label="`Tracking: ${toggleString}`"
        @change="toggleTracking()"
    ></v-switch>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { MatomoMixin } from '../mixins/Matomo/matomo-mixin'

@Component
export default class AppTrackingToggle extends Mixins(MatomoMixin) {
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /**
     * sets consentToTrack to passed param
     * @param {boolean} allow user consent to track
     */
    toggleTracking(): void {
        const allow = !this.userConsent
        this.setConsentToTrack(allow)
    }

    get toggleString(): string {
        return this.userConsent ? 'on' : 'off'
    }
}
</script>
