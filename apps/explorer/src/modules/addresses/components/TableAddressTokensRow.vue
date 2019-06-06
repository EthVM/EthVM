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
                    <v-img v-if="!token.image" :src="require('@/assets/icon-token.png')" contain />
                    <v-img v-else :src="token.image" contain />
                  </div>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout row wrap align-center justify-start>
                  <v-flex xs10 pa-1>
                    <p class="black--text text-uppercase font-weight-medium">
                      {{ token.symbol }}
                      <span class="caption text-none">({{ token.name }}) </span>
                    </p>
                  </v-flex>
                  <v-flex xs2 pa-1>
                    <v-layout grid-list-xs row justify-end pr-3>
                      <p :class="tokenChangeClass">{{ tokenPriceChange }}%</p>
                      <v-img v-if="changeInPrice === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                      <v-img v-if="changeInPrice === ''" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 pa-1>
                    <p class="info--text mb-1">
                      {{ $t('common.amount') }}:
                      <span class="black--text">{{ balance }}</span>
                    </p>
                    <p class="info--text">
                      {{ $t('usd.value') }}:
                      <span class="black--text">${{ usdValue }}</span>
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
            <v-flex sm4>
              <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-2>
                <div class="token-image">
                  <v-img v-if="!token.image" :src="require('@/assets/icon-token.png')" contain />
                  <v-img v-else :src="require('@/assets/icon-token.png')" contain />
                </div>
                <p class="black--text">
                  {{ token.name }} <span class="text-uppercase caption">({{ token.symbol }})</span>
                </p>
              </v-layout>
            </v-flex>
            <v-flex sm3>
              <p class="black--text ">{{ balance }}</p>
            </v-flex>
            <v-flex sm3>
              <p class="black--text ">
                ${{ usdValue }}
                <span class="info--text caption">(@ ${{ currPrice }} {{ $t('token.per') }} {{ token.symbol }})</span>
              </p>
            </v-flex>
            <v-flex sm2>
              <v-layout grid-list-xs row align-center justify-start pl-2 pr-2>
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
        return 'txSuccess--text'
      }
      case '-': {
        return 'txFail--text'
      }
      default: {
        return 'black--text'
      }
    }
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
