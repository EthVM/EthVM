<template>
  <div class="block-table-layout">
    <notice-new-block @reload="resetFromBlock" />

    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
    <div class="block-table-title-container">
      <!-- Title with [pagination] for dedicated [Blocks page] -->
      <title-last-blocks v-if="pageType != 'home'" :title="getTitle">
        <div class="pagination-container" v-if="pages > 1 && !hasError">
          <!-- Inserting [pagination] component into title -->
          <app-paginate
            :total="pages"
            @newPage="setPage"
            :current-page="page"
            :has-input="!simplePagination"
            :has-first="!simplePagination"
            :has-last="!simplePagination"
          />
        </div>
      </title-last-blocks>

      <!-- Title with [View All button] for [Home page] -->
      <title-last-blocks v-else :title="$t('block.last')" :button-text="$t('btn.view-all')" button-link="/blocks" />
    </div>
    <!--
    =====================================================================================
      TABLE CONTENT
    =====================================================================================
    -->
    <block-table-content v-if="!hasError && !loading" :page-type="pageType" :blocks="blocks" />

    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />

    <!--
    =====================================================================================
      LOADING
    =====================================================================================
    -->
    <v-container v-if="!hasError && loading" flat :style="getStyle" class="scroll-y pa-2">
      <v-layout column class="mb-1">
        <div xs12>
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex xs6 sm2 order-xs1>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex xs12 sm7 md6>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2 order-xs4 order-sm3>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </div>
      </v-layout>
    </v-container>

    <!--
    =====================================================================================
      BOTTOM PAGINATION
    =====================================================================================
    -->
    <div v-if="pageType != 'home' && pages > 1" class="bottom-pagination-container">
      <app-paginate
        :total="pages"
        @newPage="setPage"
        :current-page="page"
        :has-input="!simplePagination"
        :has-first="!simplePagination"
        :has-last="!simplePagination"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TitleLastBlocks from '@app/modules/blocks/components/BlockTitle/BlockTitle.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import BlockTableContent from '@app/modules/blocks/components/BlockTableContent/BlockTableContent.vue'
import { latestBlocks, newBlock, blocksByAuthor } from '@app/modules/blocks/blocks.graphql'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BlockSummaryPage_items } from '@app/core/api/apollo/types/BlockSummaryPage'
import BigNumber from 'bignumber.js'
import { Subscription } from 'rxjs'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import { BlockSummaryPageExt } from '@app/core/api/apollo/extensions/block-summary-page.ext'

const MAX_ITEMS = 50

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppInfoLoad,
    AppPaginate,
    TableBlocksRow,
    NoticeNewBlock,
    TitleLastBlocks,
    BlockTableContent
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
          return new BlockSummaryPageExt(blockSummaries)
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

  blockPage?: BlockSummaryPageExt
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

    if (resetFrom) {
      this.fromBlock = undefined
    } else {
      const { totalCountBN } = blockPage!
      if (!this.fromBlock) {
        this.fromBlock = totalCountBN.minus(1)
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
      address: this.$i18n.t('block.mined')
    }
    return titles[this.pageType]
  }

  get pages(): number {
    const { blockPage, maxItems } = this
    return blockPage ? Math.ceil(blockPage.totalCountBN.div(maxItems).toNumber()) : 0
  }
}
</script>

<style scoped lang="less">
@import 'BlockTableLayout.less';
</style>
