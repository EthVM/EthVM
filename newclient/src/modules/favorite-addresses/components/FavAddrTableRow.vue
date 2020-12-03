<template>
    <v-container pa-0>
        <v-layout ma-0>
            <!--
            =====================================================================================
              Mobile (XS-SM)
            =====================================================================================
            -->
            <v-flex hidden-md-and-up px-0>
                <div class="table-row-mobile pa-2">
                    <v-layout grid-list-xs align-center justify-start row wrap fill-height class="pa-2">
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
                                            <v-layout v-if="chips && chips.length > 0" row align-start justify-center hidden-xs-only class="px-2">
                                                <app-adr-chip v-for="(chip, index) in chips" :key="index" :chip="chip" class="mr-1" />
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 pr-1>
                                    <v-layout row align-center justify-start>
                                        <app-transform-hash :hash="hash | toChecksum" :link="`/address/${hash}`" class />
                                        <app-copy-to-clip :value-to-copy="hash" class="ml-2" />
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-spacer />
                        <!--
                    =====================================================================================
                      CHECKBOX
                    =====================================================================================
                    -->
                        <v-flex align-self-start shrink>
                            <v-layout align-start justify-end>
                                <app-check-box v-if="deleteMode" :values-array="deleteArray" :value="hash" @newCheckBoxArray="checkBoxMethod" />
                            </v-layout>
                        </v-flex>

                        <!--
                    =====================================================================================
                      Balance
                    =====================================================================================
                    -->
                        <v-flex xs12 sm5 pb-0 mb-1>
                            <v-layout row wrap>
                                <v-flex>
                                    <v-layout row align-start justify-start py-1>
                                        <v-divider vertical class="mobile-divider" />
                                        <v-flex>
                                            <p class="info--text cap-text mb-1">{{ $t('common.eth-balance') }}</p>
                                            <span v-if="balance" class="black--text"> {{ balance.value }} {{ $t(`common.${balance.unit}`) }}</span>
                                            <v-progress-linear v-else color="lineGrey" value="40" indeterminate height="16" class="mb-0 mt-2" />
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex>
                                    <v-layout row align-start justify-start py-1>
                                        <v-divider vertical class="mobile-divider" />
                                        <v-flex>
                                            <p class="info--text cap-text mb-1">{{ $t('usd.value') }}</p>
                                            <p v-if="balance" class="black--text">{{ usdBalance.value }}</p>
                                            <v-progress-linear v-else color="lineGrey" value="40" indeterminate height="16" class="mb-0 mt-2" />
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex v-if="chips && chips.length > 0" xs12 hidden-sm-and-up>
                            <!--
                        =====================================================================================
                          CHIPS on XS ONLY
                        =====================================================================================
                        -->
                            <v-layout row wrap align-center justify-start pr-2>
                                <app-adr-chip v-for="(chip, index) in chips" :key="index" :chip="chip" class="mr-1" />
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>

            <!--
            =====================================================================================
              Desktop (MD and UP)
            =====================================================================================
            -->
            <v-flex hidden-sm-and-down>
                <v-card flat white>
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="row-desktop">
                        <!--
                        =====================================================================================
                         CHECKBOX (if - deleteMode)

                          Responsive Tally:
                          MD: 12/12 (1)
                        =====================================================================================
                        -->
                        <v-flex v-if="deleteMode" md1>
                            <app-check-box :values-array="deleteArray" :value="hash" @newCheckBoxArray="checkBoxMethod" />
                        </v-flex>
                        <!--
                        =====================================================================================
                          ADDRESS BLOCKIE/HASH/CHIPS/COPY

                          Responsive Tally:
                          MD: 4/12 (4)
                        =====================================================================================
                        -->
                        <v-flex md4>
                            <v-layout grid-list-xs row align-center justify-start fill-height pr-3>
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
                          MD: 7/12 (3)
                        =====================================================================================
                        -->
                        <v-flex md3 pl-5>
                            <p class="break-string">{{ name }}</p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          ETH BALANCE

                          Responsive Tally:
                          MD: 9/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2 pl-3>
                            <p v-if="balance">
                                {{ balance.value }}<span class="info--text pl-1">{{ $t(`common.${balance.unit}`) }}</span>
                            </p>
                            <v-progress-linear v-else color="lineGrey" value="40" indeterminate height="16" class="my-0 mr-2" />
                        </v-flex>
                        <!--
                        =====================================================================================
                          USD BALANCE

                          Responsive Tally:
                          MD: 11/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2 pl-5>
                            <p v-if="balance">{{ usdBalance.value }}</p>
                            <v-progress-linear v-else color="lineGrey" value="40" indeterminate height="16" class="my-0 mr-2" />
                        </v-flex>
                        <!--
                        =====================================================================================
                          EDIT BUTTON (if - !deleteMode)
                          Responsive Tally:
                          MD: 12/12 (1)
                        =====================================================================================
                        -->
                        <v-flex v-if="!deleteMode" md1 pr-4>
                            <v-layout grid-list-xs row align-center justify-end fill-height>
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
                        <v-flex v-if="deleteMode" md1 />
                        <v-flex md11 pt-0>
                            <v-layout grid-list-xs row wrap align-center justify-start fill-height ml-5>
                                <app-adr-chip v-for="(chip, index) in chips" :key="index" :chip="chip" class="mr-2" />
                            </v-layout>
                        </v-flex>
                        <v-spacer v-if="!deleteMode" />
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
import AppCheckBox from '@app/core/components/ui/AppCheckBox.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import FavHandlerEdit from '@app/modules/favorite-addresses/handlers/FavHandlerEdit.vue'
import BN from 'bignumber.js'
import { eth } from '@app/core/helper'

@Component({
    components: {
        AppAdrChip,
        AppCopyToClip,
        AppTransformHash,
        Blockies,
        FavHandlerEdit,
        AppCheckBox
    }
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
    @Prop(Boolean) deleteMode!: boolean
    @Prop(Array) deleteArray!: string[]
    @Prop(Function) checkBoxMethod!: string[]

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    showUSD = false

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

<style scoped lang="scss">
.row-desktop {
    min-height: 60px;
}
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
.break-string {
    word-break: break-all;
}
.delete-space {
    width: 44px;
}

.cap-text {
    font-size: 9px;
}
.mobile-divider {
    height: 50px;
}
</style>
