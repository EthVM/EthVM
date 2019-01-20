<template>
  <router-link :to="'/token/' + token.address + '/holder=' + holder" v-if="token.balance != 0">
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-2>
      <v-flex xs6 sm2>
        <h5>{{ token.symbol }}</h5>
      </v-flex>
      <v-flex hidden-xs-only sm4 md3>
        <h5>{{ token.name }}</h5>
      </v-flex>
      <v-flex xs6 sm3 md4>
        <h5>{{ balance(token.balance, token.decimals) }}</h5>
      </v-flex>
      <v-flex hidden-xs-only sm3>
        <h5>
          <v-tooltip v-if="!isShortValue(getRoundNumber(balance(token.balance, token.decimals) * token.usdValue))" bottom>
            <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
            <span
              >${{ getShortValue(getRoundNumber(balance(token.balance, token.decimals) * token.usdValue)) }} (@ ${{ getRoundNumber(token.usdValue) }} per
              {{ token.symbol }})</span
            >
          </v-tooltip>
          {{ getShortValue(getRoundNumber(balance(token.balance, token.decimals) * token.usdValue)) }} (@ ${{ getRoundNumber(token.usdValue) }} per
          {{ token.symbol }})
        </h5>
      </v-flex>
    </v-layout>
  </router-link>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Token } from '@app/modules/tokens/props'

@Component
export default class TableTokensRow extends Mixins(StringConcatMixin) {
  @Prop(Object) token!: Token
  @Prop(String) holder!: string

  /*Methods: */
  balance(value, decimals) {
    const n = new BN(value)
    return n.div(new BN(10).pow(decimals)).toFixed()
  }
}
</script>
