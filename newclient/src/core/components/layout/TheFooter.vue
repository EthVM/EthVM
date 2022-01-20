<template>
    <v-footer height="auto" color="white">
        <v-layout wrap row justify-space-between fill-height>
            <!--
      =====================================================================================
        Discover

        Responsive Tally:
        XS: 6/12 (6)
        SM: 3/12 (3)
        MD: 3/12 (3)

        ORDER:
        XS: 1
      =====================================================================================
      -->

            <v-flex :class="flexClass" xs6 sm3 order-xs1>
                <v-card flat>
                    <v-layout row pa-0 align-center>
                        <v-card-title class="title font-weight-bold pb-4">{{ $t('footer.discover') }}</v-card-title>
                        <!-- <v-flex hidden-md-and-up pa-0>
                            <app-language />
                        </v-flex> -->
                    </v-layout>
                    <a href="/about">
                        <v-card-text class="pt-0 pb-3 black--text">{{ $t('about.name') }}</v-card-text>
                    </a>
                    <a href="https://www.myetherwallet.com/privacy-policy" target="_blank">
                        <v-card-text class="pt-0 pb-3 black--text">{{ $t('pp.name') }}</v-card-text>
                    </a>
                    <a href="/knowledge_base">
                        <v-card-text class="pt-0 pb-3 black--text">{{ $t('kb.name') }}</v-card-text>
                    </a>
                </v-card>
            </v-flex>

            <!--
      =====================================================================================
        Donate

        Responsive Tally:
        XS:24/12 (12)
        SM: 8/12 (5)
        MD: 6/12 (3)

        ORDER:
        XS: 3
        SM: 2
      =====================================================================================
      -->
            <v-flex :class="flexClass" xs12 sm5 md3 order-xs3 order-sm2>
                <v-card flat>
                    <v-layout row pa-0 align-center>
                        <v-card-title class="title font-weight-bold pb-4">{{ $t('footer.donate') }}</v-card-title>
                    </v-layout>
                    <v-layout row justify-start align-center>
                        <v-btn :to="ethPath" outline color="secondary" class="text-lowercase font-weight-regular donation-btn" active-class="">
                            <v-icon class="secondary--text fab fa-ethereum pr-2 asset-icon" /> <span class="text-uppercase pr-1">{{ $t('common.eth') }}</span> -
                            {{ $t('footer.ens') }}
                        </v-btn>
                        <app-copy-to-clip :value-to-copy="ethAddr"></app-copy-to-clip>
                    </v-layout>
                    <v-layout row justify-start align-center>
                        <v-btn :href="bitcoinUrl" outline color="secondary" class="text-lowercase font-weight-regular donation-btn">
                            <v-icon class="secondary--text fab fa-btc pr-2 asset-icon" />
                            <span class="text-uppercase pr-1">{{ $t('footer.btc') }}</span> - Bitcoin
                        </v-btn>
                        <app-copy-to-clip :value-to-copy="btcAddr"></app-copy-to-clip>
                    </v-layout>
                </v-card>
            </v-flex>
            <!--
      =====================================================================================
        Language and Tracking (visible only on XS and SM)

        Responsive Tally:
        XS:12/12 (6)
        SM: 12/12 (4)
        MD: NONE

        ORDER:
        XS: 2
        SM: 3
      =====================================================================================
      -->

            <v-flex :class="flexClass" xs6 sm4 hidden-md-and-up order-xs2 order-sm-3>
                <v-layout column justify-end align-end fill-height class="pt-3">
                    <app-language />
                    <app-tracking-toggle class="pr-3" />
                </v-layout>
            </v-flex>

            <!--
      =====================================================================================
        Social

        Responsive Tally:
        XS:36/12 (12)
        SM: 18/12 (6)
        MD: 9/12 (3)

        ORDER:
        XS: 4  (ALWAYS SECOND TO LAST)
      =====================================================================================
      -->
            <v-flex :class="flexClass" xs12 sm6 md3 order-xs4>
                <v-card flat>
                    <v-layout row wrap justify-start align-center fill-height>
                        <v-card-title class="title font-weight-bold pb-2">Social</v-card-title>
                        <v-flex xs12>
                            <v-layout row justify-start align-center fill-height pa-1>
                                <v-btn href="https://www.reddit.com/r/ethvm" icon class="ma-1">
                                    <v-icon small class="fab fa-reddit grey--text"></v-icon>
                                </v-btn>
                                <v-btn href="https://twitter.com/Eth_VM" icon class="ma-1"> <v-icon small class="fab fa-twitter grey--text"></v-icon> </v-btn>
                                <v-btn href="https://github.com/EthVM" icon class="ma-1"> <v-icon small class="fab fa-github grey--text"></v-icon> </v-btn>
                                <v-btn href="https://medium.com/@myetherwallet" icon class="ma-1">
                                    <v-icon small class="fab fa-medium-m grey--text"></v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout justify-start align-center fill-height pa-2>
                                <p class="info--text text-xs-left caption pl-2">
                                    {{ $t('footer.pricing') }} <a href="https://www.coingecko.com/">Coingecko.</a>
                                </p>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 pa-0>
                            <v-layout justify-start align-center>
                                <v-btn flat left class="ma-0 pa-0" @click="openMewLink()">
                                    <v-img :src="require('@/assets/powered-by-MEW.png')" height="20px" min-width="130px" contain></v-img>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <!--
      =====================================================================================
        Language

        Responsive Tally:
        XS:48/12 (12)
        SM: 24/12 (6)
        MD: 12/12 (3)

        ORDER:
        XS: 5 (ALWAYS LAST)
      =====================================================================================
      -->
            <v-flex :class="flexClass" xs12 sm6 md3 order-xs5>
                <v-layout column justify-end align-end fill-height class="pb-3">
                    <v-flex hidden-sm-and-down md12 pa-1>
                        <app-language />
                    </v-flex>
                    <v-flex xs12>
                        <v-layout hidden-sm-and-down md12 pr-3>
                            <app-tracking-toggle />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout align-end justify-end fill-height pr-3>
                            <p class="info--text text-xs-right caption">v{{ version }}</p>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout align-end justify-end fill-height pr-3>
                            <p class="info--text text-xs-right caption">© {{ $t('footer.copy') }}</p>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout align-end justify-end fill-height pr-3>
                            <p class="info--text text-xs-right caption">{{ $t('footer.mew') }}</p>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-footer>
</template>

<script lang="ts">
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppTrackingToggle from '@app/core/components/ui/AppTrackingToggle.vue'
import AppLanguage from '@app/core/components/ui/AppLanguage.vue'
import configs from '@app/configs'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    components: {
        AppCopyToClip,
        AppLanguage,
        AppTrackingToggle
    }
})
export default class TheFooter extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    btcAddr: string = '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9'
    ethAddr: string = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
    version: string = configs.VERSION || ''

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get flexClass(): string {
        return this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs' ? 'pa-1' : 'pa-3'
    }
    get bitcoinUrl(): string {
        return `https://www.blockchain.com/btc/address/${this.btcAddr}`
    }
    get ethPath(): object {
        return { name: 'address', params: { addressRef: this.ethAddr } }
    }

    openMewLink(): void {
        window.open('https://www.myetherwallet.com/', '_blank')
    }
}
</script>

<style scoped lang="css">
.donation-btn {
    width: 200px;
}
.asset-icon {
    font-size: 14px;
}
</style>
