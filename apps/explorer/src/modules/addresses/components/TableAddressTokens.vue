<template>
  <v-card color="white" flat v-if="tokens" class="pt-3 pr-2 pl-2 pb-0">
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6>
        <v-card class="primary white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('token.number') }}</v-card-text>
          <v-card-title class="headline text-truncate">{{ totalTokens }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="success white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('token.totalUSD') }}</v-card-text>
          <v-card-title class="headline text-truncate">${{ getTotalUSDValue }}</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mb-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm2>
          <h5>{{ $t('token.symbol') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm4 md3>
          <h5>{{ $t('token.name') }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md4>
          <h5>{{ $t('token.amount') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm3>
          <h5>{{ $t('token.usdValue') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->
    <app-error-no-data v-if="error"></app-error-no-data>
    <!-- Tokens List -->
    <div v-else>
      <app-info-load v-if="loading"></app-info-load>
      <div v-else>
        <v-card v-if="tokens.length === 0" flat>
          <p>{{ $t('tokens.empty') }}</p>
        </v-card>
        <div v-else v-for="(token, index) in tokens" :key="index"><table-address-tokens-row :token="token" :holder="holder" /></div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppErrorNoData from '@app/core/components/ui/AppErrorNoData.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import TableAddressTokensRow from '@app/modules/addresses/components/TableAddressTokensRow.vue'
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppErrorNoData,
    AppInfoLoad,
    TableAddressTokensRow
  }
})
export default class TableAddressTokens extends Mixins(StringConcatMixin) {
  @Prop(Array) tokens!: any[]
  @Prop(String) holder!: string
  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop({ type: Boolean, default: true }) error!: boolean

  placeholder = 'Search Tokens Symbol/Name'

  /* Methods: */
  getBalance(value, decimals) {
    const n = new BN(value)
    return n.div(new BN(10).pow(decimals)).toFixed()
  }

  /*Computed: */
  get totalTokens(): number {
    return this.tokens.length
  }

  get getTotalUSDValue(): string {
    // let totalUsdVal = 0
    // this.tokens.forEach(token => {
    //   totalUsdVal += this.getBalance(token.balance, token.decimals) * token.usdValue
    // })
    // return this.getRoundNumber(totalUsdVal)
    return '0'
  }
}
</script>
