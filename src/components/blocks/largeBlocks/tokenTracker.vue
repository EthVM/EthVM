<template>
  <div class="token-tracker">
    <div v-if="!tokens">
      <div class="info-common">
        <p> Address does not hold any common tokens </p>
      </div>
    </div>
    <!-- Show Token List -->
    <div v-else>
      <!-- Header -->
      <div class="tokens-header">
        <p> Total Number of Tokens: {{getTotalTokens}} </p>
        <p> Total Value: ${{getTotalUSDValue}}</p>
        <div class="search-block">
          <block-search :phText="placeholder"></block-search>
        </div>
        <!-- End Header -->
      </div>
      <!-- Table Header -->
      <div class="tokens-data-header">
        <p>Symbol</p>
        <p class="token-name">Name</p>
        <p>Amount</p>
        <p class="token-usd">USD Value</p>
      </div>
      <!-- End Table Header -->
    </div>
    <!-- Tokens List -->
    <div class="tokens-list" v-for="token in tokens" :key="token.symbol">
      <router-link :to="'/token/' +  token.addr.toString() + '/holder=' + holder" v-if="token.balance != 0" class="tokens-data">
        <p class="token-symbol">{{token.symbol}}</p>
        <p class="token-name">{{token.name}}</p>
        <div class="token-balance">
          <div class="">{{checkValue(getBalance(token.balance, token.decimals), false)}}</div>
          <div v-if="checkValue(getBalance(token.balance, token.decimals), true)" class="tooltip-button token-tooltip" v-tooltip="getBalance(token.balance, token.decimals)">
            <i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
        </div>
        <div v-if="token.USDValue > 0" class="token-usd">
          <p>${{formatUSDBalance(getBalance(token.balance, token.decimals)*token.USDValue)}} (@ ${{formatUSDBalance(token.USDValue)}} per {{token.symbol}})</p>
        </div>
        <div v-else class="token-usd">
          <p> $0.00</p>
        </div>
      </router-link>
      <!-- End Tokens List -->
    </div>
  </div>
  <!-- .block-container -->
</template>

<script lang="ts">
import Vue from 'vue'
import bn from 'bignumber.js'
import NumberFormatter from 'number-format.js'

export default Vue.extend({
  name: 'TokenTracker',
  props: ['tokens', 'holder'],
  data() {
    return {
      totalTokens: 0,
      totalUSDValue: 0,
      placeholder: 'Search Tokens Symbol/Name'
    }
  },
  created() {},
  computed: {
    /*Calculates total number of tokens: */
    getTotalTokens() {
      this.tokens.forEach(token => {
        if (this.checkBalance(token.balance)) {
          this.totalTokens++
        }
      })
      return this.totalTokens
    },
    /*Calculates total usd token value: */
    getTotalUSDValue() {
      const _this = this
      const usd = 0
      _this.tokens.forEach(token => {
        _this.totalUSDValue += _this.getBalance(token.balance, token.decimals) * token.USDValue
      })
      return _this.formatUSDBalance(_this.totalUSDValue)
    }
  },
  methods: {
    /* Using big number library to cast string to number: */
    checkBalance(value) {
      const n = new bn(value)
      if (n.gt(0)) {
        return true
      }
      return false
    },
    /* Getting correct Balances for the tokens -> devide by the number of decimals in the Token Contract: */
    getBalance(value, decimals) {
      const n = new bn(value)
      return n.div(new bn(10).pow(decimals)).toFixed()
    },
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
    },
    /* Format Usd Balance */
    formatUSDBalance(value) {
      const _this = this
      return NumberFormatter('#,##0.##', value)
    }
  }
})
</script>
<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/tokenTracker';
</style>
