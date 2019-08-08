<template>
  <v-card color="white" flat class="pr-2 pl-2 pt-3">
    <!-- LOADING / ERROR -->
    <v-flex v-if="loading" xs12>
      <v-progress-linear color="blue" indeterminate />
    </v-flex>
    <app-error :has-error="hasError" :message="error" class="mb-4" />
    <!-- Pagination -->
    <v-layout row fill-height justify-end class="pb-1 pr-2 pl-2" v-if="numPages > 1">
      <app-paginate :total="numPages" @newPage="setPage" :current-page="page" />
    </v-layout>
    <!-- End Pagination -->

    <!-- Table Header -->
    <div v-if="!hasError">
      <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
        <v-layout align-center justify-start row fill-height pr-3>
          <v-flex xs6 sm8 md5>
            <h5>{{ $tc('address.name', 1) }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down sm2 md4>
            <h5>{{ $t('common.quantity') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('common.percentage') }}</h5>
          </v-flex>
        </v-layout>
      </v-card>
      <!-- End Table Header -->

      <!-- Start Rows -->
      <v-card v-if="loading">
        <v-flex sm12 hidden-xs-only>
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex xs6 sm8 md5>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down sm2 md4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
      </v-card>
      <div v-else>
        <v-card v-if="!hasItems" flat>
          <v-card-text class="text-xs-center secondary--text">{{ $t('message.token.no-holders') }}</v-card-text>
        </v-card>
        <div v-else v-for="(holder, i) in holders"  :key="i">
          <token-table-holders-row :holder="holder" :decimals="decimals" :totalSupply="totalSupply" />
        </div>
      </div>
    </div>
    <!-- End Rows -->
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'
import BN from 'bignumber.js'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TokenTableHoldersRow from '@app/modules/tokens/components/TokenTableHoldersRow.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { TokenHolderPageExt, TokenHolderPageExt_items } from '@app/core/api/apollo/extensions/token-holder-page.ext'

const MAX_ITEMS = 10
import { tokenHolders } from '@app/modules/tokens/tokens.graphql'
import AppError from '@app/core/components/ui/AppError.vue'

@Component({
  components: {
    AppPaginate,
    AppError,
    TokenTableHoldersRow
  },
  data() {
    return {
      page: 0,
      error: undefined
    }
  },
  apollo: {
    holdersPage: {
      query: tokenHolders,
      variables() {
        const { addressRef, maxItems, page } = this
        return {
          address: addressRef,
          limit: maxItems,
          page: page
        }
      },
      update({ tokenHolders }) {
        if (tokenHolders) {
          this.error = '' // clear the error
          return new TokenHolderPageExt(tokenHolders)
        }
        this.error = this.error || this.$i18n.t('message.err')
        return tokenHolders
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
export default class TokenTableHolders extends Mixins(StringConcatMixin) {
  /*
    ===================================================================================
      Props
    ===================================================================================
    */

  @Prop(String) addressRef!: string
  @Prop(BN) totalSupply?: BN
  @Prop(Number) decimals?: number

  holdersPage?: TokenHolderPageExt
  error?: string
  page?: number

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  setPage(page: number): void {
    const { holdersPage: query } = this.$apollo.queries

    const self = this

    query.fetchMore({
      variables: {
        address: self.addressRef,
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

  get holders(): TokenHolderPageExt_items[] {
    return this.holdersPage ? this.holdersPage.items : []
  }

  get totalCount(): BN{
    return this.holdersPage ? this.holdersPage.totalCountBN : new BN(0)
  }

  /**
   * Given a MAX_ITEMS per page, calculate the number of pages for pagination.
   * @return {Integer} - Number of pages of results
   */
  get numPages() {
    const { holdersPage } = this
    return holdersPage ? Math.ceil(holdersPage!.totalCountBN.div(this.maxItems).toNumber()) : 0
  }

  get maxItems() {
    return MAX_ITEMS
  }

  get loading() {
    return this.$apollo.loading
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get hasItems(): boolean {
    return this.totalCount.isGreaterThan(0)
  }
}
</script>
