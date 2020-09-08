<template>
    <v-container pa-0 ma-0>
        <v-layout d-block>
            <!--
        =====================================================================================
          Mobile (XS-SM)
        =====================================================================================
      -->
            <v-flex xs12 hidden-md-and-up>
                <div class="table-row-mobile">
                    <v-layout grid-list-xs row wrap align-center justify-center class="pa-3">
                        <v-flex xs12>
                            <v-layout row align-center justify-start pa-2>
                                <p class="info--text pr-2">Holder:</p>
                                <app-transform-hash :hash="holder.owner" :link="holderLink" />
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row align-center justify-start pa-2>
                                <p class="info--text pr-2">{{ $t('common.quantity') }}:</p>
                                <p>
                                    {{ balance.value }}
                                    <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                                </p>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row align-center justify-start pa-2>
                                <p class="info--text pr-2">{{ $t('common.percentage') }}:</p>
                                <p>
                                    {{ share.value }}%
                                    <app-tooltip v-if="share.tooltipText" :text="share.tooltipText" />
                                </p>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>
            <!--
        =====================================================================================
          Desktop (SM-LG)
        =====================================================================================
      -->
            <v-flex hidden-sm-and-down>
                <v-layout align-center justify-start row fill-height pa-3>
                    <!-- Column 1: Holders Address -->
                    <v-flex sm6 pr-4>
                        <app-transform-hash :hash="holder.owner" :link="holderLink" />
                    </v-flex>
                    <!-- End Column 1 -->

                    <!-- Column 2: Balance -->
                    <v-flex sm3 md4>
                        <p class="mb-0 ml-2">
                            {{ balance.value }}
                            <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                        </p>
                    </v-flex>
                    <!-- End Column 2 -->

                    <!-- Column 3: Share -->
                    <v-flex sm3 md2>
                        <p class="mb-0 ml-2">
                            {{ share.value }}%
                            <app-tooltip v-if="share.tooltipText" :text="share.tooltipText" />
                        </p>
                    </v-flex>
                    <!-- End Column 3 -->
                </v-layout>
                <v-divider />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/ERC20TokenOwnerDetails.ts'
import BN from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import BigNumber from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppTransformHash
    }
})
export default class TokenTableHoldersRow extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) holder!: TokenOwnerInfo
    @Prop(String) tokenAddress!: string
    @Prop(Number) decimals?: number
    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    /**
     * Format url to token details -> holder view
     *
     * @param  {Object} holder - Holder object
     * @return {String}        [description]
     */
    get holderLink(): string {
        return `/token/${this.tokenAddress}?holder=${this.holder.owner}`
    }

    /**
     * Calculate percentage share of totalSupply held by this holder
     * @return {FormattedNumber} - Share
     */
    get share(): FormattedNumber {
        if (!(this.holder.tokenInfo.totalSupply && this.holder.balance)) {
            return { value: 'N/A' }
        }
        BigNumber.config({ DECIMAL_PLACES: 50 })
        const share = new BigNumber(this.holder.balance).times(100).dividedBy(this.holder.tokenInfo.totalSupply)
        return this.formatPercentageValue(share)
    }

    /**
     * Calculate and format balance held by given holder
     * @param  {Object} holder - Holder object
     * @return {Object} - FormattedNumber
     */
    get balance(): FormattedNumber {
        const balanceBN = this.decimals ? new BigNumber(this.holder.balance).div(new BN(10).pow(this.decimals)) : new BigNumber(this.holder.balance)
        return this.formatFloatingPointValue(balanceBN)
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
