<template>
  <v-card color="white" flat class="pt-3 pr-3 pl-3">
    <v-layout row grid-list-lg align-center pb-1>
      <blockies :address="account.address"></blockies>
      <v-layout wrap column fill-height pl-2>
        <v-flex xs12 pb-0>
          <v-layout row align-center justify-start>
            <v-card-title class="title font-weight-bold">{{ $t('title.address') }}</v-card-title>
            <v-chip v-if="account.isMiner" color="txSuccess" text-color="white" small>Miner</v-chip>
            <v-chip v-if="account.conCreator" color="success" text-color="white" small>Contract Creator</v-chip>
          </v-layout>
        </v-flex>
        <v-flex xs12 pt-0>
          <v-layout row wrap align-center justify-start>
            <v-card-title class="text-truncate">{{ account.address }}</v-card-title>
            <v-flex hidden-xs-only pl-0>
              <copy-to-clip-component v-if="$vuetify.breakpoint.smAndUp" :valueToCopy="account.address"></copy-to-clip-component>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex hidden-xs-only fill-height mr-3>
        <v-layout justify-end> <address-qr :addressQR="account.address" :large="true"></address-qr> </v-layout>
      </v-flex>
    </v-layout>
    <v-layout hidden-sm-and-up align-center justify-space-around row fill-height pa-2>
      <copy-to-clip-component :valueToCopy="account.address"></copy-to-clip-component>
      <address-qr :addressQR="account.address"></address-qr>
    </v-layout>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md4>
        <v-card class="primary white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('addrOverview.balance') }}</v-card-text>
          <v-card-title class="headline text-truncate">{{ formatEthBalance }} {{ $t('common.eth') }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card class="error white--text pl-2" flat>
          <v-card-text class="pb-0"> {{ $t('addrOverview.usd') }} (1{{ $t('common.eth') }} = ${{ formatEthUSD }})</v-card-text>
          <v-card-title class="headline text-truncate">${{ formatUSDBalance }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card class="warning white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('addrOverview.txN') }}</v-card-text>
          <v-card-title class="headline">{{ account.totalTxs }}</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import NumberFormatter from 'number-formatter'
import Vue from 'vue'

export default Vue.extend({
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
      return NumberFormatter('#,##0.##', this.account.balance)
    },
    formatUSDBalance() {
      return NumberFormatter('#,##0.##', this.account.balance * this.account.ethusd)
    },
    formatEthUSD() {
      return NumberFormatter('#,##0.##', this.account.ethusd)
    }
  }
})
</script>
