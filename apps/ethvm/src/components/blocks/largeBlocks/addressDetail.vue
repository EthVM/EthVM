
<template>
  <v-card color="white" flat class="pt-3 pr-3 pl-3">
    <v-layout wrap row grid-list-lg align-center pb-1>
      <v-flex d-flex xs12 sm11 md10>
        <v-layout align-center justify-start row fill-height pl-2>
          <blockies :address="account.address"></blockies>
          <v-layout wrap column fill-height>
            <v-flex xs12>
              <v-layout row align-center justify-start>
                <v-card-title class="title font-weight-bold pb-1 ">{{ $t('title.address') }}</v-card-title>
                <v-chip v-if="account.isMiner" color="txSuccess" text-color="white" small>Miner</v-chip>
                <v-chip v-if="account.conCreator" color="success" text-color="white" small>Contract Creator</v-chip>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row align-center justify-start fill-height>
                  <v-card-text style="overflow-wrap: break-word;" class="pt-1">{{account.address}}<copy-to-clip-component class="pl-2" v-show="$vuetify.breakpoint.smAndUp" :valueToCopy="account.address"></copy-to-clip-component></v-card-text>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
      <v-flex hidden-xs-only sm1 md2>
       
      </v-flex>
    </v-layout>
    <v-layout v-show="$vuetify.breakpoint.xsOnly" align-center justify-space-around row fill-height pa-2>

               <copy-to-clip-component :valueToCopy="account.address"></copy-to-clip-component>


              <address-qr></address-qr>


    </v-layout>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm4>
        <v-card class="primary white--text" flat>
          <v-card-text>{{ $t( 'addrOverview.balance' ) }}</v-card-text>
          <v-card-title>{{formatEthBalance}} {{ $t( 'common.eth')}}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4>
        <v-card class="error white--text" flat>
          <v-card-text>{{ $t( 'addrOverview.balance' ) }}</v-card-text>
          <v-card-title>{{formatEthBalance}} {{ $t( 'common.eth')}}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4>
        <v-card class="warning white--text" flat>
          <v-card-text>{{ $t( 'addrOverview.balance' ) }}</v-card-text>
          <v-card-title>{{formatEthBalance}} {{ $t( 'common.eth')}}</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>
 <!--
  <div class="details" v-if="account">

    <div class="detail-container">
      <div class="qr-container">

      </div>
      <div class="info-container">
        <div class="detail-row-copy">
          <li>{{ $t( 'common.hash' ) }}: </li>
          <div class="copy">
            <copy-to-clip-component :valueToCopy="account.address"></copy-to-clip-component>
          </div>
          <li>{{account.address}}</li>
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
    </div>
    -->


<script lang="ts">
import { common } from '@app/helpers'
import NumberFormatter from 'number-formatter'
import Vue from 'vue'

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
