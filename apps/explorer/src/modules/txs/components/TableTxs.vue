<template>
  <v-card color="white" flat class="pt-3 pb-2">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->

    <app-table-title v-if="!isAddressDetail" :page-type="pageType" :title="getTitle" page-link="/txs" :has-pagination="hasPagination">
      <template v-slot:update>
        <notice-new-block :message="$tc('message.update.tx', 2)" @reload="resetFromBlock" />
      </template>
      <template v-slot:pagination v-if="hasPagination">
        <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
      </template>
    </app-table-title>
    <!-- Address Page -->
    <v-layout v-else row wrap align-center justify space-between pr-2 pl-2>
      <v-flex v-if="isAddressDetail" xs12 md6 lg5 xl4 pr-0>
        <!-- Tx Input Filter -->
        <v-layout row align-center justify-start fill-height height="40px" pr-2>
          <v-flex shrink>
            <p class="pr-2 pl-2 ma-0">{{ $t('filter.view') }}:</p>
          </v-flex>
          <v-flex>
            <v-card flat class="tx-filter-select-container pl-2" height="36px">
              <v-select solo flat hide-details v-model="filter" class="primary body-1" :items="options" item-text="text" item-value="value" height="32px" />
            </v-card>
          </v-flex>
        </v-layout>
        <!-- End Tx Input Filter -->
      </v-flex>
      <v-spacer />
      <v-flex v-if="hasPagination" shrink hidden-sm-and-down>
        <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
      </v-flex>
      <v-flex xs12 hidden-md-and-up>
        <v-layout v-if="hasPagination" align-center justify-center pa-2>
          <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
        </v-layout>
      </v-flex>
    </v-layout>
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />

    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout pl-2 pr-2>
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
      <v-card flat v-if="!hasError" :style="getStyle" class="scroll-y pa-2" style="overflow-x: hidden">
        <v-layout column fill-height class="mb-1">
          <v-flex xs12 v-if="!loading">
            <v-card v-for="(tx, index) in transactions" class="transparent" flat :key="index">
              <table-txs-row :tx="tx" :is-pending="pending" />
            </v-card>
            <v-layout v-if="hasPagination" justify-end row class="pb-1 pt-2 pr-2 pl-2">
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
                <v-flex hidden-sm-and-down md2>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex hidden-sm-and-down md1>
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
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableTxsRow from '@app/modules/txs/components/TableTxsRow.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'
import { TransactionSummaryPageExt } from '@app/core/api/apollo/extensions/transaction-summary-page.ext'
import {
  latestTransactionSummaries,
  newTransactions,
  transactionSummariesByBlockHash,
  transactionSummariesByBlockNumber,
  transactionSummariesByAddress
} from '@app/modules/txs/txs.graphql'
import BigNumber from 'bignumber.js'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import { Subscription } from 'rxjs'

const MAX_ITEMS = 50

class TableTxsMixin extends Vue {
  pageType!: string
}

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppPaginate,
    AppTableTitle,
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
        const { blockHash: hash, blockNumber, address, filter, maxItems } = this

        return {
          number: blockNumber,
          hash,
          address,
          filter,
          limit: maxItems
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
        document: newTransactions,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { summaries } = previousResult
          const { newTransactions } = subscriptionData.data

          const items = Object.assign([], summaries.items)

          newTransactions.forEach(newTx => items.unshift(newTx))

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

          while (items.length > MAX_ITEMS) {
            items.pop()
          }

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

  mounted() {
    this.$apollo.queries.txPage.refetch()
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

  resetFromBlock() {
    this.setPage(0, true)
  }

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

  get getStyle(): string {
    return this.showStyle
  }

  get getTitle(): string {
    const titles = {
      tx: this.$i18n.t('tx.last'),
      pending: this.$i18n.tc('tx.pending', 2),
      block: this.$i18n.t('block.txs')
    }
    return titles[this.pageType] || titles['tx']
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

  get isPageTxs(): boolean {
    return this.pageType === 'tx'
  }

  get pages(): number {
    return this.txPage ? Math.ceil(this.txPage!.totalCountBN.div(this.maxItems).toNumber()) : 0
  }

  get hasPagination(): boolean {
    return this.pageType !== 'home' && this.pages > 1 && !this.hasError
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
  border: solid 1px #efefef;
  padding-top: 1px;
}
</style>
