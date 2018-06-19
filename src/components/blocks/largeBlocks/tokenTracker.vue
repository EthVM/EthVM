<template>
  <div class="token-tracker">
    <div class="block-container">
      <div v-if="getTotalTokens == 0">
        <div class="info">
          <p> Address does not hold any common tokens </p>
        </div>
      </div>
      <!-- Show Token List -->
      <div v-else>
        <!-- Header -->
        <div class="tokens-header">
          <p> Total Number of Tokens: {{totalTokens}} </p>
          <p> Total Value: $100</p>
          <div class="search-block">
            <block-search :phText="placeholder"></block-search>
          </div>
          <!-- End Header -->
        </div>
        <!-- Table Header -->
        <div class="col-md-12 table-data">
          <div class="row">
            <div class="tokens-data-header">
              <p>Symbol</p>
              <p>Name</p>
              <p>Amount</p>
              <p>USD Value</p>
            </div>
          </div>
          <!-- End Table Header -->
        </div>
        <!-- Tokens List -->
        <div class="tokens-list" v-for="token in tokens">
          <router-link :to="'/token/' +  token.addr.toString() + '/holder=' + holder" v-if="token.balance != 0" class="tokens-data">
            <p>{{token.symbol}}</p>
            <p class="token-name">{{token.name}}</p>
            <div class="token-balance">
              <div class="">{{checkValue(getBalance(token.balance, token.decimals), false)}}</div>
              <div v-if="checkValue(getBalance(token.balance, token.decimals), true)" class="tooltip-button token-tooltip" v-tooltip="getBalance(token.balance, token.decimals)">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
            </div>
            <p>{{token.USDValue}}</p>
          </router-link>
          <!-- End Tokens List -->
        </div>
      </div>
      <!-- .section-block-container -->
    </div>
    <!-- .block-container -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import bn from 'bignumber.js'
import NumberFormatter from 'number-formatter'
export default Vue.extend({
  name: 'TokenTracker',
  props: [
    'tokens',
    'holder'
  ],
  data() {
    return {
      totalTokens: 0,
      placeholder: 'Search Tokens Symbol/Name'
    }
  },
  created() {},
  computed: {
    /*Calculates total number of tokens: */
    getTotalTokens() {
      let _this = this
      _this.tokens.forEach((token) => {
        if (_this.checkBalance(token.balance)) _this.totalTokens++
      })
      return _this.totalTokens
    }
  },
  methods: {
    /* Using big number library to cast string to number: */
    checkBalance(value) {
      let n = new bn(value)
      if (n.gt(0)) return true
      else return false
    },
    /* Getting correct Balances for the tokens -> devide by the number of decimals in the Token Contract: */
    getBalance(value, decimals) {
      let n = new bn(value)
      return n.div(new bn(10).pow(decimals)).toFixed()
    },
    /* Check string length for the amounts */
    checkValue(amount, isBool) {
      let length = amount.toString().length;
      let isShort = false;
      if (length > 6) {
        amount = NumberFormatter("#,##0.##", amount)
        isShort = true;
      }
      if (!isBool)
        return amount;
      else
        return isShort;

    }
  }

})
</script>
<style scoped="" lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/tokenTracker';
</style>
