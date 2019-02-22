<template>
  <v-card flat white>
      <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
        <v-flex xs4>
          <v-layout grid-list-xs row align-center justify-start fill-height >
            <v-img :src="token.image" height="25px" max-width="25px" contain class="ml-4 mr-4"/>
            <p class="black--text text-truncate mb-0">{{ token.name }}({{token.symbol}})</p>
          </v-layout>
        </v-flex>
        <v-flex xs2>
          <p class="black--text text-truncate mb-0">${{ price }}</p>
        </v-flex>
        <v-flex xs2>
          <v-layout grid-list-xs row  align-center justify-start >
            <p :class="tokenChangeClass">{{ tokenPriceChange}}%</p>
            <v-img  v-if="changeInPrice === '+'" :src="require('@/assets/up.png')" height="18px"  max-width="18px" contain></v-img>
            <v-img  v-if="changeInPrice === ''" :src="require('@/assets/down.png')" height="18px"  max-width="18px" contain></v-img>
          </v-layout>
        </v-flex>
        <v-flex xs2>
          <p class="black--text text-truncate mb-0">${{ volume }}</p>
        </v-flex>
        <v-flex xs2>
          <p class="black--text text-truncate mb-0">${{ marketCap }}</p>
        </v-flex>
      </v-layout>
      <v-divider class="mb-2 mt-2" />
  </v-card>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { TokenExchange} from '@app/modules/tokens/props'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class TokenTableRow extends Mixins(StringConcatMixin) {
  @Prop(Object) token: TokenExchange

  //Computed
  get price(): string {
    return this.token.current_price? this.getRoundNumber(this.token.current_price) : '0.00'
  }
  get tokenPriceChange():  string {
      return this.changeInPrice != 'null' ? this.changeInPrice + this.getPercent(this.token.price_change_percentage_24h) : '0'
  }
  get volume(): string {
    return this.token.total_volume? this.getInt(this.token.total_volume) : '0'
  }

  get marketCap(): string {
    return this.token.market_cap ? this.getInt(this.token.market_cap) : '0'
  }
  get tokenChangeClass(): string{
    switch(this.changeInPrice) {
      case '+': {
        return 'txSuccess--text mb-0'
      }
      case '': {
        return 'txFail--text mb-0'
      }
      default: {
         return 'black--text mb-0'
      }
    }
  }


  get changeInPrice(): string {
    if(!this.token.price_change_percentage_24h) {
      return 'null'
    }
    return this.token.price_change_percentage_24h > 0 ? '+' : ''
  }
}


</script>
