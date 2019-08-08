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
                <p class="info--text pr-2">Holder: </p>
                <app-transform-hash :hash="holder.address" :link="holderAddress(holder)" />
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row align-center justify-start pa-2>
                <p class="info--text pr-2">{{ $t('common.quantity') }}: </p>
                <p>{{ holderBalance(holder) }}</p>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row align-center justify-start pa-2>
                <p class="info--text pr-2 ">{{ $t('common.percentage') }}}: </p>
                <p>{{ holderShare(holder) }}}</p>
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
          <v-flex sm6 md5 pr-4>
            <app-transform-hash :hash="holder.address" :link="holderAddress(holder)" />
          </v-flex>
          <!-- End Column 1 -->

          <!-- Column 2: Balance -->
          <v-flex sm3 md4>
            <p class="mb-0 ml-2">{{ holderBalance(holder) }}</p>
          </v-flex>
          <!-- End Column 2 -->

          <!-- Column 3: Share -->
          <v-flex sm3 md3>
            <p class="mb-0 ml-2">{{ holderShare(holder) }}</p>
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
  @Prop(BN) totalSupply?: BN
  @Prop(Number) decimals?: number
  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Format url to token details -> holder view
   *
   * @param  {Object} holder - Holder object
   * @return {String}        [description]
   */
  holderAddress(holder) {
    return `/token/${this.holder.address}?holder=${this.holder.address}`
  }

  /**
   * Calculate percentage share of totalSupply held by this holder
   * @param  {Object} holder - Holder object
   * @return {String} - Share
   */
  holderShare(holder: TokenHolderPageExt_items): string {
    if (!(this.totalSupply && holder.balance)) {
      return 'N/A'
    }
    return `${holder.balanceBN
      .div(this.totalSupply)
      .times(100)
      .toFormat(2)
      .toString()}%`
  }

  private calculateHolderBalance(balance: BN): BN {
    if (!this.decimals) {
      return balance
    }
    return balance.div(new BN(10).pow(this.decimals))
  }

  /**
   * Calculate and format balance held by given holder
   * @param  {Object} holder - Holder object
   * @return {String} - Amount
   */
  holderBalance(holder: TokenHolderPageExt_items): string {
    return this.calculateHolderBalance(holder.balanceBN).toString()
  }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
