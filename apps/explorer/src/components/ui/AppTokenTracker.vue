<template>
  <div class="token-tracker">
    <div v-if="!tokens">
      <div class="info-common">
        <p>{{ $t('message.noTokens') }}</p>
      </div>
    </div>
    <!-- Show Token List -->
    <div v-else>
      <!-- Header -->
      <div class="tokens-header">
        <p>{{ $t('token.number') }}</p>
        <p>{{ $t('token.totalUSD') }} ${{ getTotalUSDValue }}</p>
        <div class="search-block"><block-search :ph-text="placeholder"></block-search></div>
        <!-- End Header -->
      </div>
      <!-- Table Header -->
      <div class="tokens-data-header">
        <p>{{ $t('token.symbol') }}</p>
        <p class="token-name">{{ $t('token.name') }}</p>
        <p>{{ $t('token.amount') }}</p>
        <p class="token-usd">{{ $t('token.usdValue') }}</p>
      </div>
      <!-- End Table Header -->
    </div>
    <!-- Tokens List -->
    <div class="tokens-list" v-for="token in tokens" :key="token">
      <router-link :to="'/token/' + token.addr.toString() + '/holder=' + holder" v-if="token.balance != 0" class="tokens-data">
        <p class="token-symbol">{{ token.symbol }}</p>
        <p class="token-name">{{ token.name }}</p>
        <div class="token-balance">
          <div class>{{ checkValue(getBalanceCommand(token.balance, token.decimals), false) }}</div>
          <div
            v-if="checkValue(getBalanceCommand(token.balance, token.decimals), true)"
            class="tooltip-button token-tooltip"
            v-tooltip="getBalanceCommand(token.balance, token.decimals)"
          >
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
          </div>
        </div>
        <div v-if="token.USDValue > 0" class="token-usd">
          <p>
            ${{ formatUSDBalance(getBalanceCommand(token.balance, token.decimals) * token.USDValue) }} (@ ${{ formatUSDBalance(token.USDValue) }} per
            {{ token.symbol }})
          </p>
        </div>
        <div v-else class="token-usd"><p>$0.00</p></div>
      </router-link>
      <!-- End Tokens List -->
    </div>
  </div>
  <!-- .block-container -->
</template>

<script lang="ts">
import bn from 'bignumber.js'
import NumberFormatter from 'number-formatter'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class AppTokenTracker extends Vue {
  @Prop(Array) tokens!: Array<any>
  @Prop(String) holder!: string

  data() {
    return {
      totalTokens: 0,
      totalUSDValue: 0,
      placeholder: 'Search Tokens Symbol/Name'
    }
  }

  // Computed
  /*Calculates total number of tokens: */
  getTotalTokens() {
    let totalToken = this.totalTokens
    this.tokens.forEach(token => {
      if (this.checkBalance(token.balance)) {
        totalToken++
      }
    })
    return totalToken
  }

  /*Calculates total usd token value: */
  getTotalUSDValue() {
    const usd = 0
    let totalUsdVal = this.totalUSDValue
    this.tokens.forEach(token => {
      totalUsdVal += this.getBalance(token.balance, token.decimals) * token.USDValue
    })
    return this.formatUSDBalance(totalUsdVal)
  }

  // Methods
  /* Using big number library to cast string to number: */
  checkBalance(value) {
    const n = new bn(value)
    return n.gt(0)
  }

  /* Getting correct Balances for the tokens -> devide by the number of decimals in the Token Contract: */
  getBalance(value, decimals) {
    const n = new bn(value)
    return n.div(new bn(10).pow(decimals)).toFixed()
  }

  /* Check string length for the amounts */
  checkValue(amount, isBool) {
    const length = amount.toString().length
    let isShort = false
    if (length > 6) {
      amount = NumberFormatter('#,##0.###', amount)
      isShort = true
    }
    if (!isBool) {
      return amount
    }
    return isShort
  }

  /* Format Usd Balance */
  formatUSDBalance(value) {
    return NumberFormatter('#,##0.##', value)
  }
}
</script>

<style scoped lang="css"></style>
