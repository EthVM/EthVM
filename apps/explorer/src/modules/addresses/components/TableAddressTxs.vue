<template>
  <v-card color="white" flat class="pt-0 pr-2 pl-2 pb-2">
    <!-- Txs Filter/Sort/Search/Pagination -->
    <v-layout row wrap align-center justify-start>
      <!--
          =====================================================================================
            Search
            Responsive Tally:
            md: 9/12 (6) order-2
            sm: 18/12 (12), order-1
            xs: 24/12 (12), order-1
          =====================================================================================
      -->
      <v-flex xs12 xs order-md2>
        <app-search-input :is-valid="true" :search-id="SearchType.adrTx" />
      </v-flex>
      <!--
          =====================================================================================
            Filter & Sorting
            Responsive Tally:
            md: 3/12 (3) order-1
            sm: 6/12 (6), order-1
            xs: 12/12 (12), order-2
          =====================================================================================
      -->
      <v-flex shrink order-md1>
        <v-layout row wrap align-center>
          <!-- Filter:  -->
          <v-flex shrink pr-0>
            <p class="info--text">{{ $t('filter.name') }}</p>
          </v-flex>
          <v-flex shrink pr-0>
            <v-menu offset-y v-model="activeFilter">
              <template v-slot:activator="{ on }">
                <v-btn class="tx-filter-btn box-border text-capitalize ma-0 pa-1" flat v-on="on">
                  <div class="tx-filter-btn-content">
                    <p class="text-xs-left">{{ optionString }}</p>
                    <!-- Add Icon change/animation on activation -->
                    <v-icon class="theme--light text-xs-right primary--text">{{ filterBtn }}</v-icon>
                  </div>
                </v-btn>
              </template>
              <v-list flat>
                <v-list-tile v-for="(option, index) in options" :key="index" :value="option.value" @click="filter = option.value">
                  <!-- Add Class for active choice -->
                  <v-list-tile-title :class="[optionString === option.text ? 'primary--text' : 'black--text']">{{ option.text }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
          <!-- Sort present on xsOnly -->
          <v-flex hidden-sm-and-up shrink pr-0>
            <p class="info--text">{{ $t('common.sort') }}</p>
          </v-flex>
          <v-flex hidden-sm-and-up shrink>
            <app-sort-dialog :items="sortValues" :selected="selectedSort" @setSort="selectSort" />
          </v-flex>
        </v-layout>
      </v-flex>
      <!--
          =====================================================================================
            Pagination
            Responsive Tally:
            md: 12/12 (4) order-3
            sm: 12/12 (4), order-3
            xs: 24/12 (12), order-3
          =====================================================================================
      -->
      <v-flex pt-0 pb-0 order-xs3>
        <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
      </v-flex>
    </v-layout>
    <!-- End Filter / Search / Pagination -->

    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->

    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />

    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout>
      <v-flex hidden-xs-only sm12>
        <v-card v-if="!hasError" color="info" flat class="white--text pl-3 pr-1" height="40px">
          <v-layout row align-center justify-start>
            <v-flex sm5 md4>
              <h5>{{ $tc('tx.hash', 2) }}</h5>
            </v-flex>
            <v-flex sm2>
              <v-layout align-center justify-start row pl-1>
                <h5 class="pr-2">{{ $t('common.eth') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectSort(0)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(0) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectSort(1)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(1) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex sm2>
              <v-layout align-center justify-start row pl-1>
                <h5 class="pr-2">{{ $tc('tx.fee', 1) }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectSort(2)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(2) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectSort(3)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(3) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex sm2>
              <v-layout align-center justify-start row class="pl-1 pr-0">
                <h5 class="pr-2">{{ $t('common.age') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectSort(4)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(4) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectSort(5)" class="sort-icon-btn">
                      <v-icon :class="[isActiveSort(5) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex sm1 md2 :class="[$vuetify.breakpoint.name === 'sm' ? 'pl-0' : '']">
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
    <v-card flat v-if="!hasError" class="scroll-y" style="overflow-x: hidden">
      <v-layout column fill-height class="mb-1">
        <v-flex xs12 v-if="!loading">
          <v-card v-for="(tx, index) in transactions" class="transparent" flat :key="index">
            <table-address-txs-row :tx="tx" :adr-hash="address" />
          </v-card>
          <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
          <v-card v-if="!transactions.length" flat>
            <v-card-text class="text-xs-center secondary--text">{{ text }}</v-card-text>
          </v-card>
        </v-flex>
        <!--Note Create Separate File for mobile and desktop loading -->
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
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppSearchInput from '@app/core/components/ui/AppSearchInput.vue'
import AppSortDialog from '@app/core/components/ui/AppSortDialog.vue'
import TableAddressTxsRow from '@app/modules/addresses/components/TableAddressTxsRow.vue'
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
import { SearchType } from '../../../core/api/apollo/types/globalTypes'
import { SortItem } from '@app/core/components/props'

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
    AppSortDialog,
    TableAddressTxsRow,
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

  @Prop(Number) maxItems!: number

  @Prop(String) blockHash?: string
  @Prop(BigNumber) blockNumber?: BigNumber

  @Prop(String) address?: string

  /*
  ===================================================================================
     Initial Data
  ===================================================================================
  */

  page!: number

  error?: string

  syncing?: boolean

  fromBlock?: BigNumber
  txPage?: TransactionSummaryPageExt

  //Filter:
  filter: string = 'all'
  activeFilter: boolean = false

  connectedSubscription?: Subscription

  //Sorting:
  selectedSort: number = 0
  openSortDialog: boolean = false

  //Search:
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

  //Sorting:
  selectSort(_value: number): void {
    this.selectedSort = _value
    this.page = 0
  }
  isActiveSort(_value: number): boolean {
    return this.selectedSort === _value
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

  //Filter:
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

  get filterBtn(): string {
    return this.activeFilter ? 'arrow_drop_up' : 'arrow_drop_down'
  }

  //Sort
  get sortValues(): SortItem[] {
    return [
      { id: 0, text: this.$t('common.value'), value: 'eth_high' },
      { id: 1, text: this.$t('common.value'), value: 'eth_low' },
      { id: 2, text: this.$tc('tx.fee', 1), value: 'fee_high' },
      { id: 3, text: this.$tc('tx.fee', 1), value: 'fee_low' },
      { id: 4, text: this.$t('common.age'), value: 'age_high' },
      { id: 4, text: this.$t('common.age'), value: 'age_high' }
    ]
  }

  //Get Empty Table Message
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
.tx-filter-btn {
  width: 100px;
  height: 30px;

}
.tx-filter-btn-content {
  display: grid;
  width:80%;
  grid-template-columns: 90% 10%;
}

.tx-sort-btn {
  width: 80px;
  height: 30px;
}

.box-border{
  border: solid 1px #b4bfd2;
}

.sort-icon-btn {
  height: 12px;
  width: 12px;
  margin: 0px;
}
</style>
