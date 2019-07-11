<template>
  <v-card color="white" flat class="pr-2 pl-2 pt-3">
    <!-- LOADING / ERROR -->
    <v-flex v-if="loading" xs12>
      <v-progress-linear color="blue" indeterminate />
    </v-flex>
    <app-error :has-error="hasError" :message="error" class="mb-4" />
    <!-- Pagination -->
    <v-layout row fill-height justify-end class="pb-1 pr-2 pl-2" v-if="pages > 1">
      <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
    </v-layout>
    <!-- End Pagination -->

    <!-- Table Header -->
    <div v-if="!hasError">
      <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
        <v-layout align-center justify-start row fill-height pr-3>
          <v-flex xs12 md6>
            <h5>{{ $tc('tx.hash', 1) }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('common.age') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('common.quantity') }}</h5>
          </v-flex>
          <v-flex v-if="isInternal" hidden-sm-and-down md2>
            <h5>{{ $t('token.type') }}</h5>
          </v-flex>
        </v-layout>
      </v-card>
      <!-- End Table Header -->

      <!-- Start Rows -->
      <div v-if="loading">
        <v-flex sm12 hidden-xs-only>
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex xs12 md6>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex v-if="isInternal" hidden-sm-and-down md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
      </div>
      <div v-else>
        <v-card v-if="!hasItems" flat>
          <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
        </v-card>
        <v-card v-else color="white" v-for="(transfer, index) in transfers" class="transparent" flat :key="index">
          <transfers-table-row :transfer="transfer" :isInternal="isInternal" :decimals="decimals" />
          <v-divider class="mb-2 mt-2" />
        </v-card>
        <!-- End Rows -->
        <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
          <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
        </v-layout>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import {
  internalTransactionsByAddress,
  tokenTransfersByContractAddress,
  tokenTransfersByContractAddressForHolder
} from '@app/modules/transfers/transfers.graphql'
import { TransferPageExt } from '@app/core/api/apollo/extensions/transfer-page.ext'
import BigNumber from 'bignumber.js'
import AppError from '@app/core/components/ui/AppError.vue'
import TransfersTableRow from '@app/modules/transfers/components/TransfersTableRow.vue';

const MAX_ITEMS = 10

@Component({
  components: {
    AppTimeAgo,
    AppPaginate,
    AppError,
    TransfersTableRow
  },
  data() {
    return {
      page: 0,
      error: undefined
    }
  },
  apollo: {
    transferPage: {
      query() {
        const self = this as any
        if (self.isToken) {
          return tokenTransfersByContractAddress
        }
        if (self.isTokenHolder) {
          return tokenTransfersByContractAddressForHolder
        }
        return internalTransactionsByAddress
      },

      variables() {
        const { address, maxItems, page, holder } = this
        return {
          address,
          limit: maxItems,
          page,
          holder
        }
      },

      update({ transfers }) {
        if (transfers) {
          this.error = '' // clear the error
          return new TransferPageExt(transfers)
        }
        this.error = this.error || this.$i18n.t('message.err')
        return transfers
      },

      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      },

      skip() {
        if (!this.isTokenHolder) {
          return false
        }
        return !this.holder
      }
    }
  }
})
export default class TransfersTable extends Vue {
  /*
        ===================================================================================
          Props
        ===================================================================================
        */

  @Prop(String) address!: string
  @Prop(String) pageType!: string
  @Prop(Number) decimals?: number
  @Prop(String) holder?: string

  transferPage?: TransferPageExt
  error?: string
  page?: number

  /*
        ===================================================================================
          Methods
        ===================================================================================
        */

  setPage(page: number): void {
    const { transferPage: query } = this.$apollo.queries

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

  get isInternal(): boolean {
    return this.pageType === 'internal'
  }

  get isToken(): boolean {
    return this.pageType === 'token'
  }

  get isTokenHolder(): boolean {
    return this.pageType === 'tokenHolder'
  }

  get transfers() {
    return this.transferPage ? this.transferPage.items || [] : []
  }

  get loading() {
    return this.$apollo.loading
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get totalCount(): BigNumber {
    return this.transferPage ? this.transferPage.totalCountBN : new BigNumber(0)
  }

  get hasItems(): boolean {
    return this.totalCount.isGreaterThan(0)
  }

  /**
   * @return {Number} - Total number of pagination pages
   */
  get pages(): number {
    return this.transferPage ? Math.ceil(this.transferPage!.totalCountBN.div(this.maxItems).toNumber()) : 0
  }

  /**
   * @return {Number} - MAX_ITEMS per pagination page
   */
  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
