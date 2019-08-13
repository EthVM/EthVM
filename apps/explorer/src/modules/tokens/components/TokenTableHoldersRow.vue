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
                  {{ balanceFormatted }}
                  <v-tooltip v-if="tooltipText" bottom>
                    <template #activator="data">
                      <v-icon v-on="data.on" small class="primary--text text-xs-center pl-1">fa fa-question-circle</v-icon>
                    </template>
                    <span>{{ tooltipText }}</span>
                  </v-tooltip>
                </p>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row align-center justify-start pa-2>
                <p class="info--text pr-2 ">{{ $t('common.percentage') }}}:</p>
                <p>{{ share }}}</p>
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
              {{ balanceFormatted }}
            <v-tooltip v-if="tooltipText" bottom>
              <template #activator="data">
                <v-icon v-on="data.on" small class="primary--text text-xs-center pl-1">fa fa-question-circle</v-icon>
              </template>
              <span>{{ tooltipText }}</span>
            </v-tooltip>
            </p>
          </v-flex>
          <!-- End Column 2 -->

          <!-- Column 3: Share -->
          <v-flex sm3 md2>
            <p class="mb-0 ml-2">{{ share }}</p>
          </v-flex>
          <!-- End Column 3 -->
        </v-layout>
        <v-divider />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { TokenHolderPageExt_items } from '@app/core/api/apollo/extensions/token-holder-page.ext'
import BN from 'bignumber.js'

@Component({
  components: {
    AppTransformHash
  }
})
export default class TokenTableHoldersRow extends Vue {
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
    Computed values
  ===================================================================================
  */

  /**
   * Format url to token details -> holder view
   * @return {String}        [description]
   */
  get holderLink(): string {
    return `/token/${this.tokenAddress}?holder=${this.holder.address}`
  }

  /**
   * Calculate percentage share of totalSupply held by this holder
   * @return {String} - Share
   */
  get share(): string {
    if (!(this.totalSupply && this.holder.balance)) {
      return 'N/A'
    }
    const share = this.holder.balanceBN.div(this.totalSupply).times(100)
    if (share.isLessThan(0.01)) {
      return '< 0.01%'
    }

    return `${share.toFormat(2).toString()}%`
  }

  /**
   * Calculate and format balance held by given holder
   * @return {String} - Amount
   */
  get balanceFormatted(): string {
    const balance = this.balance
    const dp = this.decimalPlaces

    let precision = 3
    if (dp < 3) {
      precision = dp
    }
    if (balance.isLessThan(0.001)) {
      return '< 0.001'
    }
    if (dp > 3) {
      return `${balance.toFormat(precision)}...`
    }
    return balance.toFormat(precision)
  }

  get tooltipText(): string | undefined {
      if (this.decimalPlaces < 4) {
       return undefined
     }
     return this.balance.toFormat()
  }

  get balance(): BN {
      if (!this.decimals) {
          return this.holder.balanceBN
      }
      return this.holder.balanceBN.div(new BN(10).pow(this.decimals))
  }

  get decimalPlaces(): number {
      const { balance } = this
      return balance.decimalPlaces()
  }

}
</script>

<style lang="css" scoped>
.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
