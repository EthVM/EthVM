<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-0">
    <!--
    =====================================================================================
      hasError
    =====================================================================================
    -->
    <app-error v-if="hasError" :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      Display Data
    =====================================================================================
    -->
    <div v-else>
      <!--
      =====================================================================================
        Total || Loading
      =====================================================================================
      -->
      <v-layout justify-space-between row wrap class="pa-2">
        <v-flex v-if="loading" xs12>
          <v-progress-linear color="blue" indeterminate />
        </v-flex>
        <v-flex v-else xs12 sm6>
          <p class="info--text">
            {{ $t('token.total') }}
            <span class="black--text">{{ totalTokens }}</span>
            {{tokensString}}
            <span class="black--text">@ ${{ getTotalMonetaryValue }}</span>
            {{ $t('usd.value')}}
          </p>
        </v-flex>
      </v-layout>
    </div>
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
          <h5>{{ $tc('token.name', 1) }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md4>
          <h5>{{ $t('common.amount') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm3>
          <h5>{{ $t('usd.value') }}</h5>
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
              <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex hidden-xs-only sm4 md3>
              <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs6 sm3 md4>
              <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex idden-xs-only sm3>
              <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
          </v-layout>
          <v-divider class="mb-2 mt-2" />
        </div>
      </v-flex>
    </div>
    <div v-if="!loading">
      <v-card v-if="totalCount === 0" flat>
        <v-card-text class="text-xs-center secondary--text">{{ $t('token.empty') }}</v-card-text>
      </v-card>
      <div v-else v-for="(token, index) in tokens" :key="index">
        <table-address-tokens-row :token="token" :holder="address" />
      </div>
      <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
        <app-paginate :total="pages" :current-page="page" @newPage="setPage" />
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
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenPageExt } from '@app/core/api/apollo/extensions/token-page.ext'
import { addressAllTokensOwned, totalTokensValue } from '@app/modules/addresses/addresses.graphql'

const MAX_ITEMS = 10

@Component({
  components: {
    AppError,
    AppInfoLoad,
    AppPaginate,
    TableAddressTokensRow
  },
  data() {
    return {
      page: 0,
      error: undefined
    }
  },
  apollo: {
    tokensPage: {
      query: addressAllTokensOwned,

      variables() {
        const { address } = this

        return {
          address,
          offset: 0,
          limit: MAX_ITEMS
        }
      },

      update({ tokens }) {
        if (tokens) {
          this.error = '' // clear the error
          return new TokenPageExt(tokens)
        }
        this.error = this.error || this.$i18n.t('message.err')
        return tokens
      },

      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    },
    totalTokensValue: {
      query: totalTokensValue,
      variables() {
        return { address: this.address }
      },
      update({ totalTokensValue }) {
        return totalTokensValue ? new BN(totalTokensValue) : null
      },
      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class TableAddressTokens extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) address!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  tokensPage?: TokenPageExt
  error?: string
  page?: number
  totalTokensValue?: BN

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
    const { tokensPage: query } = this.$apollo.queries

    const self = this

    query.fetchMore({
      variables: {
        address: self.address,
        offset: page * this.maxItems,
        limit: this.maxItems
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        self.page = page
        return fetchMoreResult
      }
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get tokens() {
    return this.tokensPage ? this.tokensPage.items || [] : []
  }

  get loading() {
    return this.$apollo.loading
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get totalCount(): BN {
    return this.tokensPage ? this.tokensPage.totalCountBN : new BN(0)
  }

  /**
   * @return {Number} - MAX_ITEMS per pagination page
   */
  get maxItems(): number {
    return MAX_ITEMS
  }

  /**
   * @return {Number} - Total number of pagination pages
   */
  get pages(): number {
    return this.tokensPage ? Math.ceil(this.tokensPage.totalCount / this.maxItems) : 0
  }

  get getTotalMonetaryValue(): string {
    if (this.loading) {
      return this.$i18n.t('message.load').toString()
    }
    return this.totalTokensValue ? this.totalTokensValue.toFormat(2).toString() : '0.00'
  }

  get totalTokens(): string {
    if (this.loading) {
      return this.$i18n.t('message.load').toString()
    }
    return this.totalCount.toString()
  }

  get tokensString(): string {
    return this.totalCount.isGreaterThan(1) ? this.$i18n.tc('token.name', 2) : this.$i18n.tc('token.name', 1)
  }
}
</script>
