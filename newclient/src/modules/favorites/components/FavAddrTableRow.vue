<template>
    <v-container pa-1>
        <v-layout>
            <!--
            =====================================================================================
              Mobile (XS-SM)
            =====================================================================================
            -->
            <!--
            =====================================================================================
              Desktop (MD and UP)
            =====================================================================================
            -->
            <v-flex hidden-sm-and-down>
                <v-card flat white>
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pa-2">
                        <!--
                        =====================================================================================
                          ADDRESS BLOCKIE/HASH/CHIPS/COPY

                          Responsive Tally:
                          MD: 5/12 (5)
                        =====================================================================================
                        -->
                        <v-flex md5>
                            <v-layout grid-list-xs row align-center justify-space-between fill-height class="pr-5">
                                <v-flex shrink>
                                    <blockies :address="hash" width="30px" height="30px" />
                                </v-flex>
                                <app-transform-hash :hash="hash | toChecksum" :link="`/address/${hash}`" class="pl-2" />
                                <app-copy-to-clip :value-to-copy="hash" class="pl-2" />
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          ADDRESS NAME

                          Responsive Tally:
                          MD: 8/12 (3)
                        =====================================================================================
                        -->
                        <v-flex md3>
                            <p>{{ name }}</p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          ETH BALANCE

                          Responsive Tally:
                          MD: 10/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2>
                            <p v-if="balance">
                                {{ balance.value }}<span class="info--text pl-1">{{ $t(`common.${balance.unit}`) }}</span>
                            </p>
                            <v-flex v-else class="table-row-loading"></v-flex>
                        </v-flex>
                        <!--
                        =====================================================================================
                          USD BALANCE

                          Responsive Tally:
                          MD: 12/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2>
                            <v-layout grid-list-xs row align-center justify-space-between fill-height pr-3>
                                <p v-if="usdBalance">{{ usdBalance.value }}</p>
                                <v-flex v-else class="table-row-loading"></v-flex>

                                <fav-handler-edit :address="hash" :addr-chips="chips" />
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                         CHIPS

                          Responsive Tally:
                          MD: 24/12 (12)
                        =====================================================================================
                        -->
                        <v-flex md12>
                            <v-layout grid-list-xs row wrap align-center justify-start fill-height ml-5>
                                <app-adr-chip v-for="(chip, index) in chips" :chip="chip" :key="index" class="mr-2" />
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-divider class="mb-2 mt-2" />
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { EnumAdrChips } from '@app/core/components/props'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import FavHandlerEdit from '@app/modules/favorites/handlers/FavHandlerEdit.vue'
import BN from 'bignumber.js'
import { eth } from '@app/core/helper'

@Component({
    components: { AppAdrChip, AppCopyToClip, AppTransformHash, Blockies, FavHandlerEdit }
})
export default class FavAddrTableRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) hash!: string
    @Prop(String) name!: string
    @Prop(String) ethBalance?: string
    @Prop(Array) chips?: EnumAdrChips[]
    @Prop(Number) etherPrice!: number

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get usdBalance(): FormattedNumber | undefined {
        if (this.ethBalance) {
            const balanceEth = eth.toEthFromWei(this.ethBalance)
            const balanceUsd = new BN(balanceEth).multipliedBy(new BN(this.etherPrice))
            return this.formatUsdValue(balanceUsd)
        }
        return undefined
    }

    get balance(): FormattedNumber | undefined {
        if (this.ethBalance) {
            return this.formatNonVariableEthValue(new BN(this.ethBalance))
        }
        return undefined
    }
}
</script>

<style scoped lang="css">
.token-mobile {
    border: 1px solid #b4bfd2;
    padding: 10px 0px 10px 0px;
}

.v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
    margin-right: 0px;
    margin-left: 0px;
}

.token-btn-icon {
    height: auto;
    width: auto;
}

.cap-text {
    font-size: 9px;
}
</style>
