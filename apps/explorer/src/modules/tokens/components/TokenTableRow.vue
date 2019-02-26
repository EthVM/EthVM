<template>
  <v-container pa-1>
    <v-layout>
      <v-flex xs12 hidden-sm-and-up>
        <div class="token-mobile">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-3 pr-3 pt-2 pb-2">
            <v-flex xs2 pl-1 pr-1>
              <v-img :src="token.image" height="50px" max-width="50x" contain />
            </v-flex>
            <v-flex xs8 pr-0 pt-0>
              <v-layout row wrap align-end justify-start pl-2>
                <p class="black--text text-uppercase font-weight-medium mb-0 pr-1">{{ token.symbol }} -</p>
                <p class="black--text font-weight-medium mb-0 pr-1">{{ token.name }}</p>
              </v-layout>
              <v-layout row align-end justify-start pl-2>
                <p class="black--text text-truncate mb-0 pr-1">${{ price }}</p>
                <p v-if="changeInPrice != 'null'" :class="tokenChangeClass">( {{ tokenPriceChange }}%</p>
                <v-img v-if="changeInPrice === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                <v-img v-if="changeInPrice === ''" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                <p v-if="changeInPrice != 'null'" :class="tokenChangeClass">)</p>
              </v-layout>
              <v-layout row align-center justify-start pl-2>
                <p class="black--text mb-0 pr-1">${{ marketCap }}</p>
                <p class="info--text mb-0 cap-text">({{ $t('token.cap') }})</p>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-btn outline small fab color="bttnToken" :to="tokenLink">
                <v-icon class="bttnToken--text fas fa-chevron-right" small />
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex hidden-xs-only sm12>
        <v-card flat white>
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
            <v-flex xs4>
              <v-layout grid-list-xs row align-center justify-start fill-height>
                <v-img :src="token.image" height="25px" max-width="25px" contain class="ml-4 mr-4" />
                <router-link class="black--text" :to="tokenLink">{{ token.name }}</router-link>
                <p class="black--text text-uppercase mb-0 pl-1">({{ token.symbol }})</p>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <p class="black--text text-truncate mb-0">${{ price }}</p>
            </v-flex>
            <v-flex xs2>
              <v-layout grid-list-xs row align-center justify-start>
                <p :class="tokenChangeClass">{{ tokenPriceChange }}%</p>
                <v-img v-if="changeInPrice === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                <v-img v-if="changeInPrice === ''" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { TokenExchange } from '@app/modules/tokens/props'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class TokenTableRow extends Mixins(StringConcatMixin) {
  @Prop(Object) token: TokenExchange

  //Computed
  get price(): string {
    return this.token.current_price ? this.getRoundNumber(this.token.current_price) : '0.00'
  }
  get tokenPriceChange(): string {
    return this.changeInPrice != 'null' ? this.changeInPrice + this.getPercent(this.token.price_change_percentage_24h) : '0'
  }
  get volume(): string {
    return this.token.total_volume ? this.getInt(this.token.total_volume) : '0'
  }

  get marketCap(): string {
    return this.token.market_cap ? this.getInt(this.token.market_cap) : '0.00'
  }
  get tokenChangeClass(): string {
    switch (this.changeInPrice) {
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
    if (!this.token.price_change_percentage_24h) {
      return 'null'
    }
    return this.token.price_change_percentage_24h > 0 ? '+' : ''
  }

  get tokenLink():string {
    return `/token/0x${this.token.address}`
  }
}
</script>

<style scoped lang="css">
.token-mobile {
  border: 1px solid #b4bfd2;
  padding: 10px 0px 10px 0px;
}

.v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
    margin-right: 0px;
    margin-left: 0px;
}

.cap-text{
  font-size: 9px;
}
</style>
