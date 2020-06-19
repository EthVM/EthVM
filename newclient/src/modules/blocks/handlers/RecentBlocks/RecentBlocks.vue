<template>
    <v-card color="white" flat class="pt-3 pb-3">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="/blocks">
            <template v-slot:update v-if="!isHome">
                <notice-new-block @reload="setPage(0, true)" />
            </template>
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate
                    :total="totalPages"
                    :current-page="currentPage"
                    :has-input="true"
                    :has-first="true"
                    :has-last="true"
                    @newPage="setPage"
                /> </template
        ></app-table-title>
        <table-blocks :max-items="maxItems" :index="0" :is-loading="loading" :table-message="message" :block-data="blocks" :is-scroll-view="isHome" />
        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
            <app-paginate :total="totalPages" :current-page="currentPage" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getBlocksArrayByNumber, newBlockTable } from './recentBlocks.graphql'
import { getBlocksArrayByNumber_getBlocksArrayByNumber as TypeBlocks } from './apolloTypes/getBlocksArrayByNumber'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

interface BlockMap {
    [key: number]: TypeBlocks
}

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        NoticeNewBlock,
        TableBlocks
    },
    apollo: {
        getBlocksArrayByNumber: {
            query: getBlocksArrayByNumber,
            variables() {
                return {
                    limit: this.maxItems
                }
            },
            fetchPolicy: 'network-only',
            subscribeToMore: [
                {
                    document: newBlockTable,
                    updateQuery: (previousResult, { subscriptionData }) => {
                        if (subscriptionData.data.newBlockFeed) {
                            const prevB = previousResult.getBlocksArrayByNumber
                            const newB = subscriptionData.data.newBlockFeed
                            newB.txFail = 0
                            const index = prevB.findIndex(block => block.number === newB.number)
                            if (index != -1) {
                                prevB[index] = newB
                                return previousResult
                            }
                            return {
                                __typename: 'BlockSummary',
                                getBlocksArrayByNumber: [newB, ...prevB]
                            }
                        }
                    }
                }
            ],

            result({ data }) {
                if (data && data.getBlocksArrayByNumber) {
                    this.error = '' // clear the error
                    if (this.initialLoad) {
                        this.startBlock = data.getBlocksArrayByNumber[0].number
                        this.index = 0
                        this.totalPages = Math.ceil(new BN(this.startBlock).div(this.maxItems).toNumber())
                        this.initialLoad = false
                    }
                    if (this.pageType === 'home') {
                        if (this.getBlocksArrayByNumber[0].number - this.getBlocksArrayByNumber[1].number > 1) {
                            this.$apollo.queries.getBlocksArrayByNumber.refetch()
                        }
                    } else {
                        this.error = this.error || this.$i18n.t('message.err')
                    }
                }
            }
        }
    }
})
export default class RecentBlocks extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop({ type: String, default: 'home' }) pageType!: string

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    initialLoad = true
    error = ''
    syncing?: boolean = false
    getBlocksArrayByNumber!: TypeBlocks
    indexedBlocks: BlockMap = {}
    index = 0
    totalPages = 0
    startBlock!: number

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get blocks(): TypeBlocks | [] {
        if (this.indexedBlocks && this.indexedBlocks[this.index]) {
            return this.indexedBlocks[this.index]
        }
        return []
    }

    get message() {
        return ''
    }

    get getTitle(): string {
        const titles = {
            blocks: this.$i18n.t('block.last'),
            address: this.$i18n.t('block.mined'),
            home: this.$i18n.t('block.last')
        }
        return titles[this.pageType]
    }
    get loading(): boolean {
        if (this.isHome) {
            return this.initialLoad
        }
        return this.$apollo.queries.getBlocksArrayByNumber.loading
    }
    get isHome(): boolean {
        return this.pageType === 'home'
    }
    get currentPage(): number {
        return this.index
    }
    get showPagination(): boolean {
        return !this.initialLoad && !this.isHome && this.startBlock - this.maxItems > 0
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        this.index = page
        if (reset) {
            this.indexedBlocks = {}
            this.initialLoad = true
            this.$apollo.queries.getBlocksArrayByNumber.refetch()
        } else {
            const from = this.startBlock - this.maxItems * this.index
            if (from > 0 && !this.indexedBlocks[this.index]) {
                this.$apollo.queries.getBlocksArrayByNumber.fetchMore({
                    variables: {
                        fromBlock: from,
                        limit: this.maxItems
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return fetchMoreResult
                    }
                })
            }
        }
    }
    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('getBlocksArrayByNumber', { deep: true })
    onGetBlocksArrayByNumberChanged(val: TypeBlocks, oldVal: TypeBlocks) {
        if (val != oldVal) {
            this.$set(this.indexedBlocks, this.index, val)
        }
    }

    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
    mounted() {
        if (!this.isHome) {
            this.$apollo.skipAllSubscriptions = true
        }
    }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
