<template>
  <v-card color="white" flat v-if="tokens" class="pt-3 pr-2 pl-2 pb-0">
    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading" class="mt-0" />
    <app-error :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      INFO BOXES
    =====================================================================================
    -->
    <v-layout v-if="!loading" row wrap justify-space-between mb-3>
      <v-flex xs12 sm6>
        <v-card class="primary white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('token.number') }}</v-card-text>
          <v-card-title class="headline text-truncate">{{ totalTokens }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="success white--text pl-2" flat>
          <v-card-text class="pb-0">{{ $t('token.totalUSD') }}</v-card-text>
          <v-card-title class="headline text-truncate">${{ getTotalMonetaryValue }}</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-layout justify-end row class="pr-2 pl-2" v-if="totalPages > 1">
          <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
        </v-layout>
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-card color="primary" flat class="white--text pl-3 pr-1 mb-1" height="40px">
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
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <div v-if="loading">
      <v-flex xs12>
        <div v-for="i in maxItems" :key="i">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
            <v-flex xs6 sm2>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex hidden-xs-only sm4 md3>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex xs6 sm3 md4>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex idden-xs-only sm3>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
          </v-layout>
          <v-divider class="mb-2 mt-2" />
        </div>
      </v-flex>
    </div>
    <div v-if="!loading">
      <v-card v-if="totalTokens === 0" flat>
        <v-card-text class="text-xs-center secondary--text">{{ $t('tokens.empty') }}</v-card-text>
      </v-card>
      <div v-if="totalTokens > 0" v-for="(token, index) in tokensPage" :key="index">
        <table-address-tokens-row :token="token" :holder="holder" />
      </div>
      <v-layout v-if="totalTokens > 0" justify-end row class="pb-1 pr-2 pl-2">
        <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
      </v-layout>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableAddressTokensRow from '@app/modules/addresses/components/TableAddressTokensRow.vue'
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppError,
    AppInfoLoad,
    AppPaginate,
    TableAddressTokensRow
  }
})
export default class TableAddressTokens extends Mixins(StringConcatMixin) {
  @Prop(Array) tokens!: any[]
  @Prop(String) holder!: string
  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop(String) error: string

  placeholder = 'Search Tokens Symbol/Name'
  page = 0 // Current pagintion page

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getBalance(value, decimals): BN {
    return new BN(value).div(new BN(10).pow(decimals))
  }

  /**
   * Upon page update from AppPagination, set page equal to pagination page.
   */
  setPage(page: number): void {
    this.page = page
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * @return {Number} - MAX_ITEMS per pagination page
   */
  get maxItems(): number {
    return MAX_ITEMS
  }

  /**
   * @return {Number} - Total number of pagination pages
   */
  get totalPages(): number {
    return this.totalTokens > 0 ? Math.ceil(this.totalTokens / this.maxItems) : 0
  }

  /**
   * The tokens array is retrieved in its entirety. In order to correctly paginate the results,
   * the array must be sliced according to the current page number.
   *
   * @return {Array} - Current "page" of tokens results
   */
  get tokensPage(): Array<any> {
    const start = this.page * this.maxItems
    const end = start + this.maxItems
    return this.tokens.slice(start, end)
  }

  /**
   * If the error string is empty, there is no error.
   *
   * @return {Boolean} - Whether or not there is an error.
   */
  get hasError(): boolean {
    return this.error !== ''
  }

  /**
   * @return - Total number of tokens
   */
  get totalTokens(): number {
    return this.tokens.length
  }

  get getTotalMonetaryValue(): string {
    if (!this.tokens || this.tokens.length === 0) {
      return '0'
    }

    const amount = this.tokens
      .map(token => this.getBalance(token.balance, token.decimals).multipliedBy(new BN(token.currentPrice)))
      .reduceRight((acc, val) => acc.plus(val))
      .toFixed()

    return this.getShortValue(amount)
  }
}
</script>
