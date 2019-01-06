<template>
  <v-card color="white" flat class="pt-3 pr-3 pl-3">
    <v-layout row grid-list-lg align-center pb-1>
      <app-blockies :address="account.address"></app-blockies>
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
            <v-flex hidden-xs-only pl-0> <app-copy-to-clip v-if="$vuetify.breakpoint.smAndUp" :value-to-copy="account.address"></app-copy-to-clip> </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex hidden-xs-only fill-height mr-3>
        <v-layout justify-end> <app-address-qr :address-qr="account.address" :large="true"></app-address-qr> </v-layout>
      </v-flex>
    </v-layout>
    <v-layout hidden-sm-and-up align-center justify-space-around row fill-height pa-2>
      <app-copy-to-clip :value-to-copy="account.address"></app-copy-to-clip>
      <app-address-qr :address-qr="account.address"></app-address-qr>
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
          <v-card-text class="pb-0">{{ $t('addrOverview.usd') }} (1{{ $t('common.eth') }} = ${{ formatEthUSD }})</v-card-text>
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
import AppAddressQr from '@app/components/ui/AppAddressQr.vue'
import AppBlockies from '@app/components/ui/AppBlockies.vue'
import AppCopyToClip from '@app/components/ui/AppCopyToClip.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppAddressQr,
    AppBlockies,
    AppCopyToClip
  }
})
export default class AppAddressDetail extends Vue {
  @Prop(Object) account: any

  showMore: boolean = false
  domainName: string = ''

  // Computed
  get formatEthBalance() {
    return NumberFormatter('#,##0.##', this.account.balance)
  }

  get formatUSDBalance() {
    return NumberFormatter('#,##0.##', this.account.balance * this.account.ethusd)
  }

  get formatEthUSD() {
    return NumberFormatter('#,##0.##', this.account.ethusd)
  }
}
</script>
