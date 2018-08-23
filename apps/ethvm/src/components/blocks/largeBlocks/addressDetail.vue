<template>
  <div class="details" v-if="account">
    <!-- Adress Details -->
    <div class="detail-container">
      <!-- Main Info -->
      <div class="qr-container">
        <vue-qr text="account.address" :size="220"></vue-qr>
      </div>
      <div class="info-container">
        <div class="detail-row-copy">
          <li>{{ $t( 'common.hash' ) }}: </li>
          <li>{{account.address}}</li>
          <div class="copy">
            <copy-to-clip-component :valueToCopy="account.address.toString()"></copy-to-clip-component>
          </div>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'addrOverview.balance' ) }}:</li>
          <li>{{formatEthBalance}} {{ $t( 'common.eth')}}</li>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'addrOverview.usd')}}:</li>
          <li>$ {{formatUSDBalance}} (@ $ {{formatEthUSD}} {{ $t( 'addrOverview.per')}} {{ $t( 'common.eth')}})</li>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'addrOverview.txN')}}:</li>
          <li>{{account.totalTxs}}</li>
        </div>
      </div>




      <!-- End Main Info
        <transition name="fade">
          <! More details:
          <div class="detail-more" v-if="showMore">

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

          </div>
        </transition>
        <! End Detail More -->
    </div>
    <!-- End Details-->
  </div>
</template>

<script lang="ts">
  import {
    common
  } from '@app/libs'
  import NumberFormatter from 'number-formatter'
  import Vue from 'vue'
  import VueQr from 'vue-qr'

  export default Vue.extend({
    components: {
      VueQr
    },
    name: 'Address',
    props: ['account'],
    data() {
      return {
        showMore: false,
        domainName: ''
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
  @import '~lessPath/sunil/blocks/largeBlocks/addressDetail.less';
</style>
