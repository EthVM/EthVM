<template>
  <v-card color="white" flat v-if="tokens" class="pl-3 pr-3 pt-2 pb-0">
    <!-- Header -->
    <div class="tokens-header">
      <p>{{ $t('token.number') }} {{ totalTokens }}</p>
      <p>{{ $t('token.totalUSD') }} ${{ getTotalUSDValue }}</p>
      <div class="search-block"><!--<block-search :ph-text="placeholder"></block-search>--></div>
      <!-- End Header -->
    </div>
    <!-- Table Header -->
    <div class="tokens-data-header">
      <p>{{ $t('token.symbol') }}</p>
      <p class="token-name">{{ $t('token.name') }}</p>
      <p>{{ $t('token.amount') }}</p>
      <p class="token-usd">{{ $t('token.usdValue') }}</p>
    </div>
    <!-- End Table Header -->
    <app-error-no-data v-if="error"></app-error-no-data>
    <!-- Tokens List -->
    <div v-else>
      <app-info-load v-if="loading"></app-info-load>
      <div v-else>
        <v-card v-if="tokens.length === 0" flat> <p>{{ $t('tokens.empty') }}</p> </v-card>
        <div v-else v-for="token in tokens" :key="token"><table-tokens-row :token="token" :holder="holder" /></div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppErrorNoData from '@app/components/core/ui/AppErrorNoData.vue'
import AppInfoLoad from '@app/components/core/ui/AppInfoLoad.vue'
import TableTokensRow from '@app/components/tokens/ui/TableTokensRow.vue'
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/components/core/mixins'
import { Token } from '@app/components/core/props'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppErrorNoData,
    AppInfoLoad,
    TableTokensRow
  }
})
export default class TableTokens extends Mixins(StringConcatMixin) {
  @Prop(Array) tokens!: Token[]
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
    let totalToken = 0
    this.tokens.forEach(token => {
      if (token.balance != 0) {
        totalToken++
      }
    })
    return totalToken
  }

  get getTotalUSDValue(): string {
    let totalUsdVal = 0
    this.tokens.forEach(token => {
      totalUsdVal += this.getBalance(token.balance, token.decimals) * token.USDValue
    })
    return this.getRoundNumber(totalUsdVal)
  }
}
</script>
