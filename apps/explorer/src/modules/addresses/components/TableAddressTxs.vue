<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-2">
    <!-- Txs Filter/Sort/Search/Pagination -->
    <v-layout row align-bottom justify spacebetween>
      <!-- Filter -->
      <v-flex shrink>
        <v-layout row align-center justify-start>
          <v-flex shrink>
            <p class="info--text">{{ $t('filter.name') }}</p>
          </v-flex>
          <v-flex>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn class="tx-filter-select-container box-border text-capitalize ma-0" flat v-on="on">
                  <v-layout row justify-space-between text-xs-left pa-3>
                    <p class="text-xs-left">{{ optionString }}</p>
                    <!-- Add Icon change/animation on activation -->
                    <v-icon class="theme--light text-xs-right primary--text">arrow_drop_down</v-icon>
                  </v-layout>
                </v-btn>
              </template>
              <v-list flat>
                <v-list-tile v-for="(option, index) in options" :key="index" :value="option.value" @click="filter = option.value">
                  <!-- Add Class for active choice -->
                  <v-list-tile-title>{{ option.text }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Sort (MObile Only)-->
      <!-- Search -->
      <v-flex>
        <app-search-input :is-valid="true" :search-id="SearchType.adrTx" />
      </v-flex>
      <!-- Pagination -->
    </v-layout>
    <!-- End Tx Input Filter -->

    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->

    <v-layout v-if="pages > 1 && !hasError" justify-end row class="pb-1 pr-2 pl-2">
      <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
    </v-layout>

    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />

    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout>
      <v-flex hidden-sm-and-up pt-0 pb-0 pl-3>
        <app-footnotes :footnotes="footnotes" pl-2 pr-2 />
      </v-flex>
      <v-flex hidden-xs-only sm12>
        <v-card v-if="!hasError" :color="headerColor" flat class="white--text pl-3 pr-1" height="40px">
          <v-layout align-center justify-start row fill-height pr-3>
            <v-flex xs4 sm3 md1 pl-3>
              <h5>{{ $t('block.number') }}</h5>
            </v-flex>
            <v-flex xs6 sm6 md6>
              <h5>{{ $tc('tx.hash', 1) }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2 md1>
              <h5>{{ $t('common.eth') }}</h5>
            </v-flex>
            <v-flex hidden-sm-and-down md2>
              <h5>{{ $t('common.age') }}</h5>
            </v-flex>
            <v-flex hidden-sm-and-down md1>
              <h5>{{ $tc('tx.fee', 1) }}</h5>
            </v-flex>

            <v-flex hidden-xs-only sm1>
              <h5>{{ $t('tx.status') }}</h5>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <v-card flat v-if="syncing && pending">
      <v-layout row align-center justify-center fill-height>
        <v-card-title class="text-xs-center pt-5 pb-5">{{ $t('message.sync.no-pen-tx') }}</v-card-title>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card flat v-if="!hasError" :style="getStyle" class="scroll-y" style="overflow-x: hidden">
        <v-layout column fill-height class="mb-1">
          <v-flex xs12 v-if="!loading">
            <v-card v-for="(tx, index) in transactions" class="transparent" flat :key="index">
              <table-txs-row :tx="tx" :is-pending="pending" />
            </v-card>
            <v-layout v-if="pageType !== 'home' && pages > 1" justify-end row class="pb-1 pr-2 pl-2">
              <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
            </v-layout>
            <v-card v-if="!transactions.length" flat>
              <v-card-text class="text-xs-center secondary--text">{{ text }}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-if="loading">
            <div v-for="i in maxItems" :key="i">
              <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
                <v-flex xs3 sm3 md1 pl-3>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs7 sm6 md6>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs2 sm2 md1>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex hidden-sm-and-down md1>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex hidden-sm-and-down md2>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex hidden-xs-only sm1>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
              </v-layout>
              <v-divider class="mb-2 mt-2" />
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppSearchInput from '@app/core/components/ui/AppSearchInput.vue'
import TableTxsRow from '@app/modules/txs/components/TableTxsRow.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'
import { TransactionSummaryPageExt } from '@app/core/api/apollo/extensions/transaction-summary-page.ext'
import {
  latestTransactionSummaries,
  newTransaction,
  transactionSummariesByBlockHash,
  transactionSummariesByBlockNumber,
  transactionSummariesByAddress
} from '@app/modules/txs/txs.graphql'
import BigNumber from 'bignumber.js'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import { Subscription } from 'rxjs'
import { TranslateResult } from 'vue-i18n'
import { searchTypes } from '@app/core/helper'

const MAX_ITEMS = 50

class TableTxsMixin extends Vue {
  pageType!: string
}

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppPaginate,
    AppSearchInput,
    TableTxsRow,
    NoticeNewBlock
  },
  data() {
    return {
      page: 0,
      fromBlock: undefined,
      error: undefined,
      syncing: undefined
    }
  },
  apollo: {
    txPage: {
      query() {
        const self = this as any

        if (self.blockNumber) {
          return transactionSummariesByBlockNumber
        } else if (self.blockHash) {
          return transactionSummariesByBlockHash
        } else if (self.address) {
          return transactionSummariesByAddress
        }
        return latestTransactionSummaries
      },

      variables() {
        const { blockHash: hash, blockNumber, address, filter } = this

        return {
          number: blockNumber,
          hash,
          address,
          filter
        }
      },

      update({ summaries }) {
        if (summaries) {
          this.error = '' // clear the error
          this.syncing = false
          return new TransactionSummaryPageExt(summaries)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.err')
        }

        return summaries
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // do nothing
            }
          })
        }

        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      },

      subscribeToMore: {
        document: newTransaction,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { summaries } = previousResult
          const { newTransaction } = subscriptionData.data

          const items = Object.assign([], summaries.items)
          items.unshift(newTransaction)

          if (items.length > MAX_ITEMS) {
            items.pop()
          }

          // ensure order by block number desc and transaction index desc
          items.sort((a, b) => {
            const numberA = a.blockNumber ? new BigNumber(a.blockNumber) : new BigNumber(0)
            const numberB = b.blockNumber ? new BigNumber(b.blockNumber) : new BigNumber(0)
            const numberDiff = numberB.minus(numberA).toNumber()

            if (numberDiff !== 0) {
              return numberDiff
            }

            return b.transactionIndex - a.transactionIndex
          })

          return {
            ...previousResult,
            summaries: {
              ...summaries,
              items
            }
          }
        },

        skip() {
          return (this as any).pageType !== 'home'
        }
      }
    }
  }
})
export default class TableTxs extends TableTxsMixin {
  /*
      ===================================================================================
        Props
      ===================================================================================
      */

  @Prop(String) pageType!: string
  @Prop(String) showStyle!: string
  @Prop(Number) maxItems!: number

  @Prop(String) blockHash?: string
  @Prop(BigNumber) blockNumber?: BigNumber

  @Prop(String) address?: string

  page!: number

  error?: string

  syncing?: boolean

  fromBlock?: BigNumber
  txPage?: TransactionSummaryPageExt

  filter: string = 'all'

  connectedSubscription?: Subscription

  /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */
  SearchType = searchTypes

  /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

  created() {
    if (this.pageType === 'home') {
      this.connectedSubscription = this.$subscriptionState.subscribe(async state => {
        if (state === 'reconnected') {
          this.$apollo.queries.txPage.refetch()
        }
      })
    }
  }

  destroyed() {
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe()
    }
  }

  get transactions() {
    return this.txPage ? this.txPage.items || [] : []
  }

  /*
      ===================================================================================
        Methods
      ===================================================================================
      */

  setPage(page: number, resetFrom: boolean = false): void {
    const { txPage } = this
    const { txPage: query } = this.$apollo.queries

    const self = this

    if (resetFrom) {
      this.fromBlock = undefined
    } else {
      const { items } = txPage!
      if (!this.fromBlock && items!.length) {
        this.fromBlock = items![0]!.blockNumberBN
      }
    }

    query.fetchMore({
      variables: {
        fromBlock: this.fromBlock ? this.fromBlock.toString(10) : undefined,
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

  get loading() {
    return this.$apollo.loading || this.syncing
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get pending(): boolean {
    return this.pageType == 'pending'
  }

  get isBlockDetail(): boolean {
    return this.pageType === 'block'
  }

  get isAddressDetail(): boolean {
    return this.pageType === 'address'
  }

  get isHome(): boolean {
    return this.pageType === 'home'
  }

  get pages(): number {
    return this.txPage ? Math.ceil(this.txPage!.totalCountBN.div(this.maxItems).toNumber()) : 0
  }

  get footnotes(): Footnote[] {
    if (this.isAddressDetail) {
      return [
        {
          color: 'success',
          text: this.$i18n.t('filter.in'),
          icon: 'fa fa-circle'
        },
        {
          color: 'error',
          text: this.$i18n.t('filter.out'),
          icon: 'fa fa-circle'
        }
      ]
    }

    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('common.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('common.fail'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get footnoteMobile(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('common.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('common.fail'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get options() {
    return [
      {
        text: this.$i18n.t('filter.all'),
        value: 'all'
      },
      {
        text: this.$i18n.t('filter.in'),
        value: 'in'
      },
      {
        text: this.$i18n.t('filter.out'),
        value: 'out'
      }
    ]
  }

  get optionString(): TranslateResult {
    return this.options.filter(item => item.value === this.filter)[0].text
  }

  get headerColor() {
    return this.isAddressDetail ? 'primary' : 'info'
  }

  get text(): string {
    if (this.isAddressDetail) {
      const messages = {
        all: this.$i18n.t('message.tx.no-all'),
        in: this.$i18n.t('message.tx.no-in'),
        out: this.$i18n.t('message.tx.no-out')
      }
      return messages[this.filter].toString()
    }

    if (this.isBlockDetail) {
      return this.$i18n.t('message.tx.no-in-block').toString()
    }
    return this.$i18n.t('message.tx.no-history').toString()
  }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
  width: 120px;
}

.box-border{
  border: solid 1px #b4bfd2;
}

.search-tx-input{
  width:100%;
}
</style>
