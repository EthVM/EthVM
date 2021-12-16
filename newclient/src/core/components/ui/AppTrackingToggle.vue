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
      Computed
    ===================================================================================
    */

    /**
     * Property returns tracking state 'on' or 'off'
     */
    get toggleString(): string {
        return this.userConsent ? 'on' : 'off'
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */

    /**
     * Sets matomo cookie for the consent to track on the initial page load, based on value in local storage
     */
    @Watch('userConsent')
    onUserConsentChange(newVal, oldVal) {
        if (oldVal === undefined) {
            this.setConsentToTrack(newVal)
        }
    }

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
}
</script>
