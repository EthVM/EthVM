<template>
  <v-container pa-0 ma-0>
    <router-link :to="tokenLink" v-if="token.balance != 0">
      <v-layout d-block>
        <!--
        =====================================================================================
          Mobile (XS)
        =====================================================================================
        -->
        <v-flex xs12 hidden-sm-and-up>
          <div class="table-row-mobile">
            <v-layout grid-list-xs row align-center justify-center class="pt-3 pb-3 pr-2 pl-2">
              <v-flex xs2 pa-1>
                <v-layout row align-center justify-center pa-2>
                  <div class="token-image-mobile">
                    <v-img :src="image" contain />
                  </div>
                </v-layout>
              </v-flex>
              <v-flex xs10>
                <v-layout row wrap align-center justify-start>
                  <v-flex xs9 :xs12="isRopsten" pa-1>
                    <p v-if="token.name || token.symbol" class="black--text text-uppercase font-weight-medium">
                      {{ token.symbol }}
                      <span class="caption text-none">({{ token.name }}) </span>
                    </p>
                    <app-transform-hash v-else :hash="token.address" :is-blue="false"></app-transform-hash>
                  </v-flex>
                  <v-flex v-if="!isRopsten" xs3 pa-1>
                    <v-layout grid-list-xs row justify-end pr-3>
                      <p :class="token.priceChangeClass">{{ token.priceChangeFormatted }}%</p>
                      <v-img v-if="token.priceChangeSymbol === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                      <v-img v-if="token.priceChangeSymbol === ''" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                      <app-tooltip v-if="token.priceChangeTooltip " :text="token.priceChangeTooltip " />
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 pa-1>
                    <p class="info--text mb-1">
                      {{ $t('common.amount') }}:
                      <span class="black--text">
                        {{ balance.value }}
                        <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                      </span>
                    </p>
                    <p v-if="!isRopsten" class="info--text">
                      {{ $t('usd.value') }}:
                      <span class="black--text">
                        {{ usdValue }}
                        <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                      </span>
                      <span class="caption"> (@ ${{ currPrice }} {{ $t('token.per') }} {{ token.symbol }}) </span>
                    </p>
                  </v-flex>
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
          <v-layout grid-list-xs row wrap align-center justify-start fill-height>
            <v-flex sm4 :sm6="isRopsten">
              <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-2>
                <div class="token-image">
                  <v-img :src="image" contain />
                </div>
                <p v-if="token.name || token.symbol" class="black--text">
                  {{ token.name }} <span v-if="token.symbol" class="text-uppercase caption">({{ token.symbol }})</span>
                </p>
                <app-transform-hash v-else :hash="token.address" :is-blue="false"></app-transform-hash>
              </v-layout>
            </v-flex>
            <v-flex sm3 :sm6="isRopsten">
              <p class="black--text ">
                {{ balance.value }}
                <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
              </p>
            </v-flex>
            <v-flex v-if="!isRopsten" sm3>
              <p class="black--text ">
                {{ usdValue }}
                <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                <span class="info--text caption"> (@ ${{ currPrice }} {{ $t('token.per') }} {{ token.symbol }})</span>
              </p>
            </v-flex>
            <v-flex v-if="!isRopsten" sm2>
              <v-layout grid-list-xs row align-center justify-start pl-2 pr-2>
                <p :class="token.priceChangeClass">
                  {{ token.priceChangeFormatted }}%
                </p>
                <v-img v-if="token.priceChangeSymbol === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                <v-img v-if="token.priceChangeSymbol === '-'" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                <app-tooltip v-if="token.priceChangeTooltip" :text="token.priceChangeTooltip" />
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider />
        </v-flex>
      </v-layout>
    </router-link>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenBalancePageExt_items } from '@app/core/api/apollo/extensions/token-balance-page.ext'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppNumericValueTooltip from '@app/core/components/ui/AppNumericValueTooltip.vue'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
@Component({
  components: {
      AppTooltip,
      AppTransformHash,
  }
})
export default class TableAddressTokensRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) token!: TokenBalancePageExt_items
  @Prop(String) holder!: string
  @Prop(Boolean) isRopsten?: boolean

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get image(): string {
    return this.token.image || require('@/assets/icon-token.png')
  }

  get balance(): FormattedNumber {
    return this.token.balanceFormatted
  }

  get tokenLink(): string {
    return `/token/${this.token.address}?holder=${this.holder}`
  }

  get currPrice(): string {
    return this.token.currentPriceFormatted.value
  }

  get usdValueFormatted(): FormattedNumber {
    return this.token.usdValueFormatted
  }

  get usdValue(): string {
    return this.usdValueFormatted.value.substring(0, 1) === '<' ? this.usdValueFormatted.value : `${this.usdValueFormatted.value}`
  }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

p {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
