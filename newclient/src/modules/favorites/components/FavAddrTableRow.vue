<template>
    <v-container pa-1>
        <v-layout>
            <!--
            =====================================================================================
              Mobile (XS-SM)
            =====================================================================================
            -->
            <v-flex hidden-md-and-up>
                <v-layout grid-list-sm align-center justify-start row wrap fill-height mt-2 mb-2 pa-2 class="table-row-mobile">
                    <!--
                    =====================================================================================
                      BLOCKIE
                    =====================================================================================
                    -->
                    <v-flex shrink>
                        <blockies :address="hash" width="36px" height="36px" />
                    </v-flex>
                    <!--
                    =====================================================================================
                      ADDRESS NAME / HASH / COPY / EDIT
                    =====================================================================================
                    -->
                    <v-flex xs8 sm10>
                        <v-layout row wrap align-center justify-start pl-2>
                            <v-flex xs12>
                                <v-layout row align-center justify-start>
                                    <v-card-title class="body-1 font-weight-bold pa-0 break-string">{{ name }}</v-card-title>
                                    <fav-handler-edit :address="hash" :addr-chips="chips" class="pr-1" @errorFavorites="emitErrorState" />
                                    <!--
                                    =====================================================================================
                                      CHIPS on SM ONLY
                                    =====================================================================================
                                    -->
                                    <v-flex hidden-xs-only shrink>
                                        <v-layout v-if="chips && chips.length > 0" row align-start justify-center hidden-xs-only>
                                            <app-adr-chip v-for="(chip, index) in chips" :chip="chip" :key="index" class="mr-1" />
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row align-center justify-start>
                                    <app-transform-hash :hash="hash | toChecksum" :link="`/address/${hash}`" class />
                                    <app-copy-to-clip :value-to-copy="hash" />
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex shrink> </v-flex>
                    <!--
                    =====================================================================================
                      Balance
                    =====================================================================================
                    -->
                    <v-flex xs12 pb-0>
                        <p class="info--text">
                            {{ $t('common.eth-balance') }}:
                            <span v-if="balance" class="black--text"> {{ balance.value }} {{ $t(`common.${balance.unit}`) }}</span>

                            <span v-else class="table-row-loading" />
                        </p>
                    </v-flex>
                    <v-flex xs12>
                        <p class="info--text">
                            {{ $t('usd.value') }}: <span v-if="balance" class="black--text"> {{ usdBalance.value }}</span>
                            <span v-else class="table-row-loading" />
                        </p>
                    </v-flex>

                    <v-flex v-if="chips && chips.length > 0" xs12 hidden-sm-and-up>
                        <!--
                        =====================================================================================
                          CHIPS on XS ONLY
                        =====================================================================================
                        -->
                        <v-layout row wrap align-center justify-start pr-2>
                            <app-adr-chip v-for="(chip, index) in chips" :chip="chip" :key="index" class="mr-1" />
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>

            <!--
            =====================================================================================
              Desktop (MD and UP)
            =====================================================================================
            -->
            <v-flex hidden-sm-and-down>
                <v-card flat white>
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pr-2 pl-2 row-desktop">
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
                            <p class="break-string">{{ name }}</p>
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

                                <fav-handler-edit :address="hash" :addr-chips="chips" @errorFavorites="emitErrorState" />
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                         CHIPS

                          Responsive Tally:
                          MD: 24/12 (12)
                        =====================================================================================
                        -->
                        <v-flex md12 pt-0>
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

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    emitErrorState(val: boolean, message: string): void {
        this.$emit('errorFavorites', val, message)
    }
}
</script>

<style scoped lang="css">
.row-desktop {
    min-height: 60px;
}
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
.break-string {
    word-break: break-all;
}
</style>
