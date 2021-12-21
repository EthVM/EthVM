<template>
    <v-dialog v-if="!userDisplayedTrackingPopup" v-model="dialog" width="360" persistent scrollable>
        <v-card v-if="dialog">
            <v-card-title class="title font-weight-regular consent-title">
                {{ $t('tracking-consent.dialog.title') }}
            </v-card-title>
            <v-divider class="lineGrey" />
            <v-card-text class="consent-content pa-0">
                <div v-for="item in constentText" :key="item.title">
                    <v-layout row wrap class="px-4 pt-4 pb-3">
                        <v-flex xs2 class="pl-2"
                            ><v-icon>{{ item.icon }}</v-icon></v-flex
                        >
                        <v-flex xs10 pr-4>
                            <p class="body-2 font-weight-bold mb-2">{{ item.title }}</p>
                            <p v-for="(i, n) in item.content" :key="n" class="body-1 mb-2">
                                <span v-if="i.isBPoint"><v-icon size="6px" class="fas fa-circle mb-1 mr-2" /></span>{{ i.text }}
                            </p>
                        </v-flex>
                    </v-layout>
                    <v-divider class="lineGrey" />
                </div>
                <v-btn flat color="secondary" block class="text-capitalize" href="https://www.myetherwallet.com/privacy-policy" target="_blank">
                    {{ $t('tracking-consent.dialog.privacy-link') }} <span><v-icon size="12px" class="fas fa-external-link-alt ml-2" /></span>
                </v-btn>
                <v-divider class="lineGrey" />
            </v-card-text>
            <v-card-actions>
                <v-layout row wrap class="px-3">
                    <v-flex xs12 my-2>
                        <v-btn block depressed color="secondary" class="text-capitalize" @click="allowTracking(true)">
                            {{ $t('tracking-consent.dialog.allow') }}
                        </v-btn>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn flat color="error" block class="text-capitalize" @click="allowTracking(false)">
                            {{ $t('tracking-consent.dialog.dont-allow') }}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { MatomoMixin } from '../mixins/Matomo/matomo-mixin'
import { GreetMixin } from '../mixins/Greet/greeting-mixin'

@Component
export default class AppTrackingConsent extends Mixins(MatomoMixin, GreetMixin) {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    dialog = false
    constentText = [
        {
            title: this.$t('tracking-consent.dialog-panel-1.title'),
            icon: 'far fa-chart-bar',
            content: [
                {
                    text: this.$t('tracking-consent.dialog-panel-1.text')
                },
                {
                    text: this.$t('tracking-consent.dialog-panel-1.bul-1'),
                    isBPoint: true
                },
                {
                    text: this.$t('tracking-consent.dialog-panel-1.bul-2'),
                    isBPoint: true
                },
                {
                    text: this.$t('tracking-consent.dialog-panel-1.bul-3'),
                    isBPoint: true
                }
            ]
        },
        {
            title: this.$t('tracking-consent.dialog-panel-2.title'),
            icon: 'fas fa-user-secret',
            content: [
                {
                    text: this.$t('tracking-consent.dialog-panel-2.text')
                }
            ]
        },
        {
            title: this.$t('tracking-consent.dialog-panel-3.title'),
            icon: 'fas fa-lock',
            content: [
                {
                    text: this.$t('tracking-consent.dialog-panel-3.text')
                }
            ]
        },
        {
            title: this.$t('tracking-consent.dialog-panel-4.title'),
            icon: 'fas fa-toggle-on',
            content: [
                {
                    text: this.$t('tracking-consent.dialog-panel-4.text')
                }
            ]
        }
    ]
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /**
     * Removes dialog and sets consentToTrack to passed param
     * @param {boolean} allow user consent to track
     */
    allowTracking(allow: boolean): void {
        this.setConsentToTrack(allow)
        this.dialog = false
        this.setDisplayedTrackingPopupTrue()
    }
    /**
     * Method open consent dialog after 4 sec
     */
    openDialog(): void {
        setTimeout(() => {
            this.dialog = true
        }, 4000)
    }
    /*
  ===================================================================================
    Watch
  ===================================================================================
  */
    /**
     * Watches changes in userNotFirstTime.
     * If changed from false or undefined(on loading) to true -> opens consent dialog
     */
    @Watch('userNotFirstTime')
    onUserNotFirstTimeChange(): void {
        if (this.userNotFirstTime && !this.userDisplayedTrackingPopup) {
            this.openDialog()
        }
    }
}
</script>

<style scoped lang="css">
.consent-title {
    line-height: 28px !important;
}
.consent-content {
    max-height: 322px;
}
</style>
