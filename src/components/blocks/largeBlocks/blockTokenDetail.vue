<template>
  <div class="details" v-if="token">
    <!-- Header -->
    <div class="block-title-container">
      <h3 class="block-title">Overview {{token.name}}</h3>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === false">More</button>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === true">Less</button>
      <!-- End Header -->
    </div>
    <!-- Token Details -->
    <div class="detail-container">
      <!-- Main Info -->
      <div v-if="isHolder" class="detail-row-copy">
        <li>Holder</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="token.holder"></copy-to-clip-component>
        </div>
        <li>
          <router-link :to="'/address/'+token.holder">{{token.holder}}</router-link>
        </li>
      </div>
      <div v-if="isHolder" class="detail-row">
        <li>Balance</li>
        <li>{{token.balance}} {{token.symbol}} </li>
      </div>
      <div v-if="!isHolder" class="detail-row">
        <li>Total Supply</li>
        <li>{{token.totalSupply}}</li>
      </div>
      <div v-if="!isHolder" class="detail-row">
        <li>Total Holders</li>
        <li>{{token.totalHolders}}</li>
      </div>
      <div class="detail-row">
        <li>USD Value</li>
        <li>{{formatUSDBalance}}</li>
      </div>
      <div class="detail-row">
        <li>Symbol</li>
        <li>{{token.symbol}}</li>
      </div>
      <!-- End Main Info -->
      <transition name="fade">
        <!-- More Info -->
        <div class="detail-more" v-if="showMore">
          <div class="detail-row">
            <li>Total Trasfers</li>
            <li>{{token.transfers}}</li>
          </div>
          <div class="detail-row">
            <li>ETH Value</li>
            <li>{{token.valueETH}}</li>
          </div>
          <div class="detail-row-copy">
            <li>Contract</li>
            <div class="copy">
              <copy-to-clip-component :valueToCopy="token.contract"></copy-to-clip-component>
            </div>
            <li>
              <router-link :to="'/address/'+token.contract">{{token.contract}}</router-link>
            </li>
          </div>
          <div class="detail-row">
            <li>Decimals</li>
            <li>{{token.decimals}}</li>
          </div>
          <!-- More Info -->
        </div>
      </transition>
      <!-- End Token Details -->
    </div>
    <!--End details -->
  </div>
</template>

<script lang="ts">
  import {
    common
  } from '@/libs'
  import NumberFormatter from 'number-formatter'
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Address',
    props: ['token', 'isHolder'],
    data() {
      return {
        showMore: false
      }
    },
    mounted() {
      // console.log(_this.token)
    },
    computed: {
      formatUSDBalance() {
        return NumberFormatter('#,##0.##', this.token.balance * this.token.valueUSD)
      },

      formatTotalTransf() {
        return NumberFormatter('#,##0.', this.token.trasfers)
      }
    }
  })
</script>

<style scoped="" lang="less">
  @import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
