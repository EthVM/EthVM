<template>
  <div class="details" v-if="account">
    <!-- Header -->
    <div class="block-title-container">
      <div id="icon" class="identicon">
      </div>
      <h3 class="block-title">{{ $t( 'title.overview')}} {{domainName}}</h3>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === false">{{ $t( 'bttn.more')}}</button>
      <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === true">{{ $t( 'bttn.less')}}</button>
      <!-- End Header -->
    </div>
    <!-- Adress Details -->
    <div class="detail-container">
      <!-- Main Info -->
      <div class="detail-row">
        <li>{{ $t( 'title.address' ) }}</li>
        <li>{{account.address}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'addrOverview.balance' ) }}</li>
        <li>{{formatEthBalance}} {{ $t( 'common.eth')}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'addrOverview.usd')}}</li>
        <li>$ {{formatUSDBalance}} (@ $ {{formatEthUSD}} {{ $t( 'addrOverview.per')}} {{ $t( 'common.eth')}})</li>
      </div>
      <!-- End Main Info -->
      <transition name="fade">
        <!-- More details: -->
        <div class="detail-more" v-if="showMore">
          <div class="detail-row">
            <li>{{ $t( 'addrOverview.txN')}}</li>
            <li>{{account.totalTxs}}</li>
          </div>
          <div class="detail-row">
            <li>{{ $t( 'addrOverview.mined')}}</li>
            <li>23,534 {{ $t( 'title.blocks')}} {{ $t( 'addrOverview.and')}} 239 {{ $t( 'addrOverview.uncles')}}</li>
          </div>
          <div class="detail-row">
            <li>{{ $t( 'addrOverview.creator')}}</li>
            <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>
          </div>
          <div class="detail-row">
            <li>{{ $t( 'addrOverview.forTx')}}</li>
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
import { common } from '@app/helpers'
import blockies from 'ethereum-blockies'
import NumberFormatter from 'number-formatter'
import Vue from 'vue'

export default Vue.extend({
  name: 'Address',
  props: ['account'],
  data() {
    return {
      showMore: false,
      identicon: null,
      domainName: ''
    }
  },
  mounted() {
    this.getIdenticon()
  },
  methods: {
    getIdenticon() {
      this.identicon = document.getElementById('icon')
      this.identicon.style.backgroundImage =
        'url(' +
        blockies
          .create({
            seed: this.account.address,
            size: 5,
            scale: 3
          })
          .toDataURL() +
        ')'
    }
  },
  computed: {
    formatEthBalance() {
      return NumberFormatter('#,##0.#####', this.account.balance)
    },
    formatUSDBalance() {
      return NumberFormatter('#,##0.##', this.account.balance * this.account.ethusd)
    },
    formatEthUSD() {
      return NumberFormatter('#,##0.#####', this.account.ethusd)
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
