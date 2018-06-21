<template>
  <div class="details" v-if="account">
    <!-- Header -->
    <div class="block-title-container">
      <div id="icon" class="identicon">
      </div>
      <h3 class="block-title">Overview {{domainName}}</h3>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === false">More</button>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === true">Less</button>
      <!-- End Header -->
    </div>
    <!-- Adress Details -->
    <div class="detail-container">
      <!-- Main Info -->
      <div class="detail-row">
        <li>Address</li>
        <li>{{account.address}}</li>
      </div>
      <div class="detail-row">
        <li>Ether Balance</li>
        <li>{{formatEthBalance}} ETH</li>
      </div>
      <div class="detail-row">
        <li>USD Value</li>
        <li>$ {{formatUSDBalance}} (@ $ {{formatEthUSD}} per ETH)</li>
      </div>
      <!-- End Main Info -->
      <transition name="fade">
        <!-- More details: -->
        <div class="detail-more" v-if="showMore">
          <div class="detail-row">
            <li>Number of TXs</li>
            <li>{{account.totalTxs}}</li>
          </div>
          <div class="detail-row">
            <li>Mined</li>
            <li>23,534 Blocks and 239 Uncles</li>
          </div>
          <div class="detail-row">
            <li>Contract Creator</li>
            <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>
          </div>
          <div class="detail-row">
            <li>for TX</li>
            <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>
          </div>
          <!-- End Detail More -->
        </div>
      </transition>
    </div>
    <!-- End Details-->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {
  common
} from '@/libs';
import NumberFormatter from 'number-formatter';
import blockies from 'ethereum-blockies';
export default Vue.extend({
  name: 'Address',
  props: [
    'account'
  ],
  data() {
    return {
      showMore: false,
      identicon: null,
      domainName: ''
    }
  },
  mounted() {
    let _this = this
    _this.getIdenticon();
  },
  methods: {
    getIdenticon() {
      let _this = this
      _this.identicon = document.getElementById('icon');
      _this.identicon.style.backgroundImage = 'url(' + blockies.create({
        seed: _this.account.address,
        size: 5,
        scale: 3
      }).toDataURL() + ')'
    }
  },
  computed: {
    formatEthBalance() {
      let _this = this
      return NumberFormatter("#,##0.#####", _this.account.balance)
    },
    formatUSDBalance() {
      let _this = this
      return NumberFormatter("#,##0.##", (_this.account.balance * _this.account.ethusd))
    },
    formatEthUSD() {
      let _this = this
      return NumberFormatter("#,##0.#####", _this.account.ethusd)
    }
  }
});
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/blocks/largeBlocks/detailComponent.less";
</style>
