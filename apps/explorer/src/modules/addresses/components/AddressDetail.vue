<template>
  <v-card color="white" flat class="pt-3 pr-3 pl-3">
    <v-layout row grid-list-lg align-center pb-1>
      <blockies :address="account.address" />
      <v-layout wrap column fill-height pl-2>
        <v-flex xs12 pb-0>
          <v-layout row align-center justify-start>
            <v-card-title class="title font-weight-bold">{{ title }}</v-card-title>
            <v-chip v-if="account.type === 'address' && account.isMiner" color="txSuccess" text-color="white" small>{{ $t('block.miner') }}</v-chip>
            <v-chip v-if="account.type === 'address' && account.isCreator" color="success" text-color="white" small>{{ $t('addrOverview.creator') }}</v-chip>
          </v-layout>
        </v-flex>
        <v-flex xs12 pt-0>
          <v-layout row wrap align-center justify-start>
            <v-card-title class="text-truncate">{{ account.address }}</v-card-title>
            <v-flex hidden-xs-only pl-0> <app-copy-to-clip v-if="$vuetify.breakpoint.smAndUp" :value-to-copy="account.address" /> </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex hidden-xs-only fill-height mr-3>
        <v-layout justify-end> <address-qr :address="account.address" :large="true" /> </v-layout>
      </v-flex>
    </v-layout>
    <v-layout hidden-sm-and-up align-center justify-space-around row fill-height pa-2>
      <app-copy-to-clip :value-to-copy="account.address" />
      <address-qr :address-qr="account.address" />
    </v-layout>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md4>
        <v-card class="primary white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('addrOverview.balance') }}</v-card-text>
          <v-card-title class="headline text-truncate">{{ account.balance.toEth() }} {{ $t('common.eth') }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card class="error white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('addrOverview.usd') }} (1{{ $t('common.eth') }} = ${{ getRoundNumber(account.exchangeRate.USD) }})</v-card-text>
          <v-card-title class="headline text-truncate">${{ getRoundNumber(account.balance.toEth() * account.exchangeRate.USD) }}</v-card-title>
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
import { StringConcatMixin } from '@app/core/components/mixins'
import AddressQr from '@app/modules/addresses/components/AddressQr.vue'
import Blockies from '@app/modules/addresses/components/Blockies.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import { AccountInfo } from '@app/modules/addresses/props'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AddressQr,
    Blockies,
    AppCopyToClip
  }
})
export default class AddressDetail extends Mixins(StringConcatMixin) {
  @Prop(Object) account: AccountInfo

  /* Computed: */
  get title(): string {
    const titles = {
      address: this.$i18n.t('title.address'),
      contract: this.$i18n.t('title.contract')
    }
    return titles[this.account.type]
  }
}
</script>
