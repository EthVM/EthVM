<template>
    <v-dialog v-model="dialog" width="360" persistent scrollable>
        <v-card v-if="dialog">
            <v-card-title class="title font-weight-regular consent-title">
                Help us make EthVM better by allowing us to measure a few things?
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
                <v-btn flat color="secondary" block class="text-capitalize">
                    View our full tracking policy <span><v-icon size="12px" class="fas fa-external-link-alt ml-2" /></span>
                </v-btn>
                <v-divider class="lineGrey" />
            </v-card-text>
            <v-card-actions>
                <v-layout row wrap class="px-3">
                    <v-flex xs12 my-2>
                        <v-btn block depressed color="secondary" class="text-capitalize" @click="allowTracking(true)">
                            Allow
                        </v-btn>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn flat color="error" block class="text-capitalize" @click="allowTracking(false)">
                            Don't allow
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
            title: 'What we collect',
            icon: 'far fa-chart-bar',
            content: [
                {
                    text: 'We will only measure how users are using the product:'
                },
                {
                    text: 'What features they use',
                    isBPoint: true
                },
                {
                    text: 'How long it takes to complete a process',
                    isBPoint: true
                },
                {
                    text: 'Where users drop off when completing an action',
                    isBPoint: true
                }
            ]
        },
        {
            title: 'Annonimity',
            icon: 'fas fa-user-secret',
            content: [
                {
                    text: 'We will never collect user’s full IP address or exact location so you can remain anonymous'
                }
            ]
        },
        {
            title: 'Privacy',
            icon: 'fas fa-lock',
            content: [
                {
                    text: 'We cannot access any personal data: No seed words, no private keys, no public adress nor passwords'
                }
            ]
        },
        {
            title: 'Opt out at any time',
            icon: 'fas fa-toggle-on',
            content: [
                {
                    text: 'Data sharing can be turned on and off from the Dashboard’s sidebar menu and the site’s footers'
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
