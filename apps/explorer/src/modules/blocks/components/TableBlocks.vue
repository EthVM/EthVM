<template>
  <v-card color="white" flat class="pt-3 pb-2 mt-0">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
    <app-table-title :page-type="pageType" :title="getTitle" page-link="/blocks" :has-pagination="hasPagination">
      <template v-slot:update>
        <notice-new-block v-if="isPageBlocks" @reload="resetFromBlock" />
      </template>
      <template v-slot:pagination v-if="hasPagination">
        <app-paginate
          v-if="!isPageDetailsAddress"
          :total="pages"
          @newPage="setPage"
          :current-page="page"
          :has-input="!simplePagination"
          :has-first="!simplePagination"
          :has-last="!simplePagination"
        />
        <app-paginate-has-more v-else :current-page="page" :has-more="blockPage.hasMore" @newPage="setPage" />
      </template>
    </app-table-title>

    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout pl-2 pr-2>
      <v-flex hidden-xs-only sm12>
        <v-card v-if="!hasError" color="info" flat class="white--text pl-3 pr-1 table-blocks-header-card" height="40px">
          <v-layout align-center justify-start row fill-height pr-3>
            <v-flex sm2>
              <h5>{{ $t('block.number') }}</h5>
            </v-flex>
            <v-spacer />
            <v-flex sm2>
              <h5>{{ $tc('tx.name', 2) }}</h5>
            </v-flex>
            <v-flex sm1 xl2>
              <h5>{{ $t('miner.reward-short') }}</h5>
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
    <v-container v-if="!hasError" flat :style="getStyle" class="scroll-y pa-2">
      <v-layout column class="mb-1">
        <v-flex v-if="!loading">
          <div v-for="(block, index) in blocks" :key="index">
            <table-blocks-row :block="block" :page-type="pageType" />
          </div>
          <v-layout v-if="hasPagination" justify-end row class="pb-1 pt-2 pr-2 pl-2">
            <app-paginate
              v-if="!isPageDetailsAddress"
              :total="pages"
              @newPage="setPage"
              :current-page="page"
              :has-input="!simplePagination"
              :has-first="!simplePagination"
              :has-last="!simplePagination"
            />
            <app-paginate-has-more v-else :current-page="page" :has-more="blockPage.hasMore" @newPage="setPage" />
          </v-layout>
        </v-flex>
        <div xs12 v-if="loading">
          <div v-for="i in maxItems" :key="i">
            <div :class="[$vuetify.breakpoint.name === 'xs' ? 'table-row-mobile ma-2' : '']">
              <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-4 pr-4 pt-2">
                <v-flex xs4 sm2>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-spacer class="hidden-sm-and-up" />
                <v-flex xs3 class="hidden-sm-and-up">
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs12 sm7 xl6>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs12 sm2>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs4 sm1 xl2>
                  <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
              </v-layout>
              <v-divider class="mb-2 mt-2 hidden-xs-only" />
            </div>
            <div></div>
          </div>
        </div>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import { latestBlocks, newBlock, blocksByAuthor } from '@app/modules/blocks/blocks.graphql'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BlockSummaryPage_items } from '@app/core/api/apollo/types/BlockSummaryPage'
import BigNumber from 'bignumber.js'
import { Subscription } from 'rxjs'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import { BlockSummaryPageExt } from '@app/core/api/apollo/extensions/block-summary-page.ext'
import { BlockSummaryByAuthorPageExt } from '@app/core/api/apollo/extensions/block-summary-by-author-page.ext'

const MAX_ITEMS = 50

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppInfoLoad,
    AppPaginate,
    AppTableTitle,
    TableBlocksRow,
    NoticeNewBlock,
    AppPaginateHasMore
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
    blockPage: {
      query() {
        const self = this as any

        return self.author ? blocksByAuthor : latestBlocks
      },

      fetchPolicy: 'cache-and-network',

      variables() {
        return {
          offset: 0,
          limit: this.maxItems,
          author: this.author
        }
      },

      update({ blockSummaries }) {
        if (blockSummaries) {
          this.error = '' // clear error
          return this.isPageDetailsAddress ? new BlockSummaryByAuthorPageExt(blockSummaries) : new BlockSummaryPageExt(blockSummaries)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.err')
        }
        return blockSummaries
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
        document: newBlock,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { blockSummaries } = previousResult
          const { newBlock } = subscriptionData.data

          const items = Object.assign([], blockSummaries.items)
          items.unshift(newBlock)

          if (items.length > MAX_ITEMS) {
            items.pop()
          }

          // ensure order by block number desc
          items.sort((a, b) => {
            const numberA = a.number ? new BigNumber(a.number) : new BigNumber(0)
            const numberB = b.number ? new BigNumber(b.number) : new BigNumber(0)
            return numberB.minus(numberA).toNumber()
          })

          return {
            ...previousResult,
            blockSummaries: {
              ...blockSummaries,
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
export default class TableBlocks extends Vue {
  /*
        ===================================================================================
          Props
        ===================================================================================
        */

  @Prop({ type: String, default: 'blocks' }) pageType!: string
  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop({ type: Number, default: 20 }) maxItems!: number
  @Prop({ type: Boolean, default: false }) simplePagination!: boolean
  @Prop({ type: String }) author?: string

  page!: number
  error: string = ''
  syncing?: boolean
  blockPage?: BlockSummaryPageExt | BlockSummaryByAuthorPageExt
  fromBlock?: BigNumber

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
          this.$apollo.queries.blockPage.refetch()
        }
      })
    }
  }

  mounted() {
    this.$apollo.queries.blockPage.refetch()
  }

  destroyed() {
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe()
    }
  }

  get blocks(): (BlockSummaryPage_items | null)[] {
    return this.blockPage ? this.blockPage.items || [] : []
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
    const { blockPage } = this
    const { blockPage: query } = this.$apollo.queries

    if (resetFrom || this.isPageDetailsAddress) {
      this.fromBlock = undefined
    } else {
      const { totalCountBN } = blockPage! as BlockSummaryPageExt
      if (!this.fromBlock) {
        this.fromBlock = totalCountBN
      }
    }

    query.fetchMore({
      variables: {
        fromBlock: this.fromBlock ? this.fromBlock.toString(10) : undefined,
        offset: page * this.maxItems,
        limit: this.maxItems
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        this.page = page
        return fetchMoreResult
      }
    })
  }

  /*
        ===================================================================================
          Computed Values
        ===================================================================================
        */

  get loading(): boolean | undefined {
    return this.$apollo.queries.blockPage.loading || this.syncing
  }

  get isPageHome(): boolean {
    return this.pageType === 'home'
  }

  get isPageBlocks(): boolean {
    return this.pageType === 'blocks'
  }

  get isPageDetailsAddress(): boolean {
    return this.pageType === 'address'
  }

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get getStyle(): string {
    return this.showStyle
  }

  get getTitle(): string {
    const titles = {
      blocks: this.$i18n.t('block.last'),
      address: this.$i18n.t('block.mined'),
      home: this.$i18n.t('block.last')
    }
    return titles[this.pageType]
  }

  get pages(): number {
    if (this.isPageDetailsAddress) {
      throw new Error('Cannot determine pages for block summaries by author')
    }
    const { blockPage, maxItems } = this
    return blockPage ? Math.ceil((blockPage as BlockSummaryPageExt).totalCountBN.div(maxItems).toNumber()) : 0
  }

  get hasPagination(): boolean {
    if (this.isPageDetailsAddress) {
      if (this.page && this.page > 0) {
        // If we're past the first page, there must be pagination
        return true
      } else if (this.blockPage && (this.blockPage as BlockSummaryByAuthorPageExt).hasMore) {
        // We're on the first page, but there are more items, show pagination
        return true
      }
      return false
    }

    return this.pageType !== 'home' && this.pages > 1 && !this.hasError
  }
}
</script>

<style scoped lang="css">
.title-live {
  min-height: 60px;
}
.table-blocks-header-card {
  margin-right: 1px;
}
.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
