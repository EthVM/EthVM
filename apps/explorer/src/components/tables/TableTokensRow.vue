<template>
  <router-link :to="'/token/' + token.address + '/holder=' + holder" v-if="token.balance != 0" class="tokens-data">
    <p class="token-symbol">{{ token.symbol }}</p>
    hello
    <p class="token-name">{{ token.name }}</p>
    <div class="token-balance">
      <div class>{{ getShortValue(balance(token.balance, token.decimals), false) }}</div>
      <div
        v-if="getShortValue(balance(token.balance, token.decimals), true)"
        class="tooltip-button token-tooltip"
        v-tooltip="balance(token.balance, token.decimals)"
      >
        <i class="fa fa-question-circle-o" aria-hidden="true"></i>
      </div>
    </div>
    <div v-if="token.USDValue > 0" class="token-usd">
      <p>${{ getRoundNumber(balance(token.balance, token.decimals) * token.USDValue) }} (@ ${{ getRoundNumber(token.USDValue) }} per {{ token.symbol }})</p>
    </div>
    <div v-else class="token-usd"><p>$0.00</p></div>
  </router-link>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Token } from '@app/props'

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
