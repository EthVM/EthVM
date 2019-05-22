<template>
  <v-card color="white" flat class="pr-2 pl-2 pt-3">
    <!-- LOADING / ERROR -->
    <v-flex v-if="loading" xs12>
      <v-progress-linear color="blue" indeterminate/>
    </v-flex>
    <app-error :has-error="hasError" :message="error" class="mb-4"/>
    <!-- Pagination -->
    <v-layout row fill-height justify-end class="pb-1 pr-2 pl-2" v-if="pages > 1">
      <app-paginate :total="pages" @newPage="setPage" :current-page="page"/>
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
            <v-divider class="mb-2 mt-2"/>
          </div>
        </v-flex>
      </div>
      <div v-else>
        <v-card v-if="!hasItems" flat>
          <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
        </v-card>
        <v-card v-else color="white" v-for="(transfer, index) in transfers" class="transparent" flat :key="index">
          <v-layout align-center justify-start row fill-height pr-3>
            <!-- Column 1 -->
            <v-flex xs12 md6>
              <v-flex d-flex xs12 pb-2>
                <router-link class="primary--text text-truncate font-italic psmall" :to="`/tx/${transfer.transactionHash}`">
                  {{ transfer.transactionHash }}
                </router-link>
              </v-flex>
              <v-flex xs12 pt-0>
                <v-layout row pl-2>
                  <p class="text-truncate info--text mb-0">
                    {{ $t('tx.from') }}:
                    <router-link :to="`/address/${transfer.from}`" class="secondary--text font-italic font-weight-regular">
                      {{ transfer.from }}
                    </router-link>
                  </p>
                  <v-icon class="fas fa-arrow-right primary--text pl-1 pr-2 pb-1" small></v-icon>
                  <!-- TODO transfer.contract -->
                  <p class="text-truncate info--text font-weight-thin mb-0" v-if="transfer.contract">
                    {{ $tc('contract.name', 1) }}:
                    <router-link class="secondary--text font-italic font-weight-regular" :to="`/address/${transfer.address}`">
                      {{ transfer.address }}
                    </router-link>
                  </p>
                  <p class="text-truncate info--text font-weight-thin mb-0" v-else>
                    <strong>{{ $t('tx.to') }}:</strong>
                    <router-link class="secondary--text font-italic font-weight-regular" :to="`/address/${transfer.to}`">
                      {{ transfer.to }}
                    </router-link>
                  </p>
                </v-layout>
              </v-flex>
            </v-flex>
            <!-- End Column 1 -->

            <!-- Column 2 -->
            <v-flex hidden-sm-and-down md2>
              <app-time-ago :timestamp="transfer.timestampDate"/>
            </v-flex>
            <!-- End Column 2 -->

            <!-- Column 3 -->
            <v-flex hidden-sm-and-down md2>
              <p>{{ calculateTransferValue(transfer.value) }}</p>
            </v-flex>
            <!-- End Column 3 -->

            <!-- Column 4 -->
            <v-flex v-if="isInternal" hidden-sm-and-down md2>
              <p>{{ $t('transfer.' + transfer.deltaType) }}</p>
            </v-flex>
            <!-- End Column 4 -->
          </v-layout>
          <v-divider class="mb-2 mt-2"/>
        </v-card>
        <!-- End Rows -->
        <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
          <app-paginate :total="pages" @newPage="setPage" :current-page="page"/>
        </v-layout>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import BN from 'bignumber.js'
  import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
  import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
  import { EthValue } from '@app/core/models'
  import {
    internalTransactionsByAddress,
    tokenTransfersByContractAddress,
    tokenTransfersByContractAddressForHolder
  } from '@app/modules/transfers/transfers.graphql'
  import { TransferPageExt } from '@app/core/api/apollo/extensions/transfer-page.ext'
  import BigNumber from 'bignumber.js'
  import AppError from '@app/core/components/ui/AppError.vue'

  const MAX_ITEMS = 10

  @Component({
    components: {
      AppTimeAgo,
      AppPaginate,
      AppError
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
          const {address, maxItems, page, holder} = this
          return {
            address,
            limit: maxItems,
            page,
            holder
          }
        },

        update({transfers}) {
          if (transfers) {
            this.error = '' // clear the error
            return new TransferPageExt(transfers)
          }
          this.error = this.error || this.$i18n.t('message.err')
          return transfers
        },

        error({graphQLErrors, networkError}) {
          // TODO refine
          if (networkError) {
            this.error = this.$i18n.t('message.no-data')
          }
        },

        skip() {
          if (!this.isTokenHolder) return false
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
      const {transferPage: query} = this.$apollo.queries

      const self = this

      query.fetchMore({
        variables: {
          address: self.address,
          offset: page * this.maxItems,
          limit: this.maxItems
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          self.page = page
          return fetchMoreResult
        }
      })
    }

    calculateTransferValue(value: string) {
      if (this.isInternal) {
        return new EthValue(value).toEthFormatted().toString()
      }

      let n = new BN(value)

      if (this.decimals) {
        n = n.div(new BN(10).pow(this.decimals))
      }
      return n.toFormat(2).toString()
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
<style scoped lang="css">
  .table-row-loading {
    background: #e6e6e6;
    height: 12px;
    border-radius: 2px;
  }
</style>
