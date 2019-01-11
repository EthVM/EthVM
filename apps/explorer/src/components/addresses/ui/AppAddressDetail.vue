<template>
  <v-card color="white" flat class="pt-3 pr-3 pl-3">
    <v-layout row grid-list-lg align-center pb-1>
      <app-blockies :address="account.address"></app-blockies>
      <v-layout wrap column fill-height pl-2>
        <v-flex xs12 pb-0>
          <v-layout row align-center justify-start>
            <v-card-title class="title font-weight-bold">{{ title }}</v-card-title>
            <v-chip v-if="typeAddrs === 'address' && account.isMiner" color="txSuccess" text-color="white" small>{{ $t('block.miner') }}</v-chip>
            <v-chip v-if="typeAddrs === 'address' && account.conCreator" color="success" text-color="white" small>{{ $t('addrOverview.creator') }}</v-chip>
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
          <v-card-title class="headline text-truncate">{{ getRoundNumber(this.account.balance) }} {{ $t('common.eth') }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card class="error white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('addrOverview.usd') }} (1{{ $t('common.eth') }} = ${{ getRoundNumber(this.account.ethusd) }})</v-card-text>
          <v-card-title class="headline text-truncate">${{ getRoundNumber(this.account.balance * this.account.ethusd) }}</v-card-title>
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
import { StringConcatMixin } from '@app/components/core/mixins'
import AppAddressQr from '@app/components/addresses/ui/AppAddressQr.vue'
import AppBlockies from '@app/components/addresses/ui/AppBlockies.vue'
import AppCopyToClip from '@app/components/core/ui/AppCopyToClip.vue'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppAddressQr,
    AppBlockies,
    AppCopyToClip
  }
})
export default class AppAddressDetail extends Mixins(StringConcatMixin) {
  @Prop(Object) account: any
  @Prop({ type: String, default: 'address' }) typeAddrs!: string

  data() {
    return {
      titles: {
        address: this.$i18n.t('title.address'),
        contract: this.$i18n.t('tx.contract')
      }
    }
  }

  /* Computed: */
  get title(): string {
    return this.titles[this.typeAddrs]
  }
}
</script>
