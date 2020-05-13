<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
        =====================================================================================
          Mobile (XS)
        =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div class="table-row-mobile">
          <v-layout grid-list-xs row wrap align-center justify-center class="pa-3">
            <v-flex xs12>
              <v-layout row align-center justify-start pa-2>
                <p class="info--text pr-2">Holder:</p>
                <app-transform-hash :hash="holder.address" :link="holderLink" />
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
                <p class="info--text pr-2 ">{{ $t('common.percentage') }}:</p>
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
      <v-flex hidden-xs-only>
        <v-layout align-center justify-start row fill-height pa-3>
          <!-- Column 1: Holders Address -->
          <v-flex sm6 pr-4>
            <app-transform-hash :hash="holder.address" :link="holderLink" />
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
import { TokenHolderPageExt_items } from '@app/core/api/apollo/extensions/token-holder-page.ext'
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

  @Prop(TokenHolderPageExt_items) holder!: TokenHolderPageExt_items
  @Prop(String) tokenAddress!: string
  @Prop(BN) totalSupply?: BN
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
    return `/token/${this.tokenAddress}?holder=${this.holder.address}`
  }

  /**
   * Calculate percentage share of totalSupply held by this holder
   * @return {FormattedNumber} - Share
   */
  get share(): FormattedNumber {
    if (!(this.totalSupply && this.holder.balance)) {
      return { value: 'N/A' }
    }
    BigNumber.config({ DECIMAL_PLACES: 50 }) // Ensure precision is not lost when performing division operations with very small results
    const share = this.holder.balanceBN.times(100).dividedBy(this.totalSupply)
    return this.formatPercentageValue(share)
  }

  /**
   * Calculate and format balance held by given holder
   * @param  {Object} holder - Holder object
   * @return {Object} - FormattedNumber
   */
  get balance(): FormattedNumber {
    const balanceBN = this.decimals ? this.holder.balanceBN.div(new BN(10).pow(this.decimals)) : this.holder.balanceBN
    return this.formatFloatingPointValue(balanceBN)
  }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
