<template>
  <v-container pa-0 ma-0>
    <router-link :to="tokenLink" v-if="token.balance != 0">
      <v-layout d-block>
        <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
        <v-flex xs12 hidden-sm-and-up> </v-flex>
        <!--
      =====================================================================================
        Desktop (SM-LG)
      =====================================================================================
      -->
        <v-flex hidden-xs-only>
          <v-layout grid-list-xs row wrap align-center justify-start fill-height >
            <v-flex sm4>
              <v-layout grid-list-xs row align-center justify-start fill-height  pl-2 pr-2>
                <!-- Add token image here -->
                <div class="token-image" >
                  <v-img v-if="!token.image" :src="require('@/assets/icon-token.png')" contain />
                  <v-img v-else :src="require('@/assets/icon-token.png')" contain />
                </div>
                <p class="black--text mb-0">
                  {{ token.name }} <span class="text-uppercase caption">({{ token.symbol }})</span>
                </p>
              </v-layout>
            </v-flex>
            <v-flex sm3>
              <p class="black--text mb-0">{{ balance }}</p>
            </v-flex>
            <v-flex sm3>
              <p class="black--text mb-0">
                ${{ usdValue }}
                <span class="info--text caption">(@ ${{ currPrice }} {{ $t('token.per') }} {{ token.symbol }})</span>
              </p>
            </v-flex>
            <v-flex sm2>
              <v-layout grid-list-xs row align-center justify-start  pl-2 pr-2>
                <p :class="tokenChangeClass">{{ tokenPriceChange }}%</p>
                <v-img v-if="changeInPrice === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                <v-img v-if="changeInPrice === ''" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
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
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenPageExt_items } from '@app/core/api/apollo/extensions/token-page.ext'

@Component
export default class TableAddressTokensRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) token!: TokenPageExt_items
  @Prop(String) holder!: string

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get balance(): string {
    return this.token.formattedBalance
  }

  get tokenLink(): string {
    return `/token/${this.token.address}?holder=${this.holder}`
  }

  get currPrice(): string {
    return this.token.currentPriceBN ? this.getRoundNumber(this.token.currentPriceBN) : '0.00'
  }

  get usdValue(): string {
    return this.getRoundNumber(this.token.usdValueBN)
  }

  get changeInPrice(): string {
    const { priceChange24hBN } = this.token

    if (!priceChange24hBN || priceChange24hBN.toNumber() === 0) {
      return 'null'
    }

    return priceChange24hBN.toNumber() > 0 ? '+' : '-'
  }

  get tokenPriceChange(): string {
    return this.changeInPrice != 'null' ? `${this.changeInPrice}${this.getPercent(this.token.priceChange24h)}` : '0'
  }

  get tokenChangeClass(): string {
    switch (this.changeInPrice) {
      case '+': {
        return 'txSuccess--text mb-0'
      }
      case '-': {
        return 'txFail--text mb-0'
      }
      default: {
        return 'black--text mb-0'
      }
    }
  }

}
</script>

