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

      </v-flex>
      <!--
      =====================================================================================
        Desktop (SM-LG)
      =====================================================================================
      -->
      <v-flex hidden-xs-only>
        <v-layout grid-list-lg row wrap align-center justify-start fill-height pl-3>
          <v-flex sm4 >
            <v-layout grid-list-xs row align-center justify-start fill-height>
                <!-- Add token image here -->
                <!-- <v-img :src="token.image" height="25px" max-width="25px" contain class="ml-4 mr-4" /> -->
                <p class="black--text mb-0"> {{ token.name }} <span class="text-uppercase">({{ token.symbol }})</span></p>
              </v-layout>
          </v-flex>
          <v-flex sm3>
            <p class="black--text mb-0">{{ balance}}</p>
          </v-flex>
          <v-flex sm3>
           <p class="black--text mb-0">
             ${{ usdValue }}
             <span class="info--text caption">(@ ${{ currPrice }} {{$t('token.per')}} {{token.symbol}})</span>
           </p>
          </v-flex>
          <v-flex sm2>
            <v-layout grid-list-xs row align-center justify-start>
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

@Component
export default class TableAddressTokensRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) token!: any
  @Prop(String) holder!: string

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */




  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */


  get balance(): string{
    return new BN(this.token.balance)
      .div(new BN(10).pow(this.token.decimals)).toFixed()
  }

  get tokenLink(): string {
    return `/token/${this.token.addr}?holder=${this.holder}`
  }

  get currPrice(): string {
    return this.token.currentPrice? this.getRoundNumber(new BN(this.token.currentPrice)) : '0.00'
  }

  get  usdValue(): string{
    return this.token.currentPrice ? this.getRoundNumber(new BN(new BN(this.balance())).multipliedBy(this.token.currentPrice)) : '0.00'
  }


  //TODO: implement token price change
  get changeInPrice(): string {
    // if (!this.token.priceChangePercentage24h) {
    //   return 'null'
    // }
    // const priceChangeAsBN = new BN(this.token.priceChangePercentage24h)
    // if (priceChangeAsBN.toNumber() === 0) {
    //   return 'null'
    // }
    // return priceChangeAsBN.toNumber() > 0 ? '+' : '-'
    return 'null'
  }

  get tokenPriceChange(): string {
    return this.changeInPrice != 'null' ? `${this.changeInPrice}${this.getPercent(this.token.priceChangePercentage24h)}` : '0'
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
