<template>
  <div class="token-overview-container">
    <button class="top-right-button-common" v-on:click="showMore = !showMore" v-if="showMore === false">More</button>
    <button class="top-right-button-common" v-on:click="showMore = !showMore" v-if="showMore === true">Less</button>
    <h2>{{token.name}}</h2>
    <div class="detail">
      <ul v-if="isHolder" class="grid-block">
        <li>Holder</li>
        <li>{{token.holder}}</li>
        <li>Balance</li>
        <li>{{token.balance}} {{token.symbol}} </li>
      </ul>
      <ul v-else class="grid-block">
        <li>Total Supply</li>
        <li>{{token.totalSupply}}</li>
        <li>Total Holders</li>
        <li>{{token.totalHolders}}</li>
      </ul>
      <ul class="grid-block">
        <li>USD Value</li>
        <li>{{formatUSDBalance}}</li>
        <li>Symbol</li>
        <li>{{token.symbol}}</li>
      </ul>
      <ul v-if="showMore" class="grid-block">
        <li>Total Trasfers</li>
        <li>{{token.transfers}}</li>
        <li>ETH Value</li>
        <li>{{token.valueETH}}</li>
        <li>Contract</li>
        <li><router-link :to="'/address/'+token.contract">{{token.contract}}</router-link></li>
        <li>Decimals</li>
        <li>{{token.decimals}}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {
  common
} from '@/libs';
import NumberFormatter from 'number-formatter'
export default Vue.extend({
  name: 'Address',
  props: [
   'token', 'isHolder'
  ],
  data() {
    return {
      showMore: false,
    }
  },
  methods: {},
  computed: {

    formatUSDBalance() {
      let _this = this
      return NumberFormatter("#,##0.##", (_this.token.balance * _this.token.valueUSD))
    },

    formatTotalTransf() {
      let _this = this
      return NumberFormatter("#,##0.", (_this.token.trasfers))
    }
  }
})
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/frames/tokenDetail.less";
</style>
