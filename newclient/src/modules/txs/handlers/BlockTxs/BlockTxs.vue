<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="/txs">
            <template v-slot:update v-if="!isHome && !isBlock">
                <notice-new-block @reload="setPage(0, true)" />
            </template>
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate
                    v-if="isBlock"
                    :total="totalPages"
                    :current-page="index"
                    :has-input="isBlock"
                    :has-first="isBlock"
                    :has-last="isBlock"
                    @newPage="setPage"
                />
                <app-paginate-has-more v-else :has-more="hasMore" :current-page="index" @newPage="setPage" /> </template
        ></app-table-title>
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :table-message="message" :txs-data="transactions" :is-scroll-view="isHome" />
        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
            <app-paginate
                v-if="isBlock"
                :total="totalPages"
                :current-page="index"
                :has-input="isBlock"
                :has-first="isBlock"
                :has-last="isBlock"
                @newPage="setPage"
            />
            <app-paginate-has-more v-else :has-more="hasMore" :current-page="index" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getBlockTransfers, getAllTxs } from './queryTransfers.graphql'
import {
    getBlockTransfers_getBlockTransfers as TypeBlockTransfers,
    getBlockTransfers_getBlockTransfers_transfers as TypeTransfers
} from './getBlockTransfers.type'
import { getAllTxs_getAllEthTransfers as AllTxType } from './getAllTxs.type'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        AppPaginateHasMore,
        NoticeNewBlock,
        TableTxs
    },
    apollo: {
        getBlockTransfers: {
            query: getBlockTransfers,
            fetchPolicy: 'network-only',
            skip() {
                return !this.isBlock
            },
            variables() {
                return this.blockRef ? { _number: parseInt(this.blockRef) } : undefined
            },
            result({ data }) {
                if (data && data.getBlockTransfers) {
                    this.error = '' // clear the error
                    this.initialLoad = false
                    if (data.getBlockTransfers.transfers.length > 0) {
                        this.totalPages = Math.ceil(new BN(data.getBlockTransfers.transfers.length).div(this.maxItems).toNumber())
                    }
                } else {
                    this.error = this.error || this.$i18n.t('message.err')
                }
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
            }
        },
        getAllEthTransfers: {
            query: getAllTxs,
            fetchPolicy: 'network-only',
            variables() {
                return {
                    _limit: this.maxItems,
                    _nextKey: null
                }
            },
            skip() {
                return this.isBlock
            },
            result({ data }) {
                if (data && data.getAllEthTransfers && data.getAllEthTransfers.transfers) {
                    this.error = '' // clear the error
                    this.initialLoad = false
                } else {
                    console.log('error failed no data: ', data)
                    this.error = this.error || this.$i18n.t('message.err')
                    this.initialLoad = true
                    this.$apollo.queries.getAllEthTransfers.refetch()
                }
            }
        }
    }
})
export default class HomeTxs extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(Number) newBlock?: number
    @Prop({ type: String, default: 'home' }) pageType!: string
    @Prop(String) blockRef?: string
    @Prop({ type: Boolean, default: false }) isHash!: boolean

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    initialLoad = true
    error = ''
    syncing?: boolean = false
    getBlockTransfers!: TypeBlockTransfers
    getAllEthTransfers!: AllTxType
    index = 0
    totalPages = 0
    isEnd = 0

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transactions(): (TypeTransfers | null)[] | [] {
        if (this.isBlock && this.getBlockTransfers && this.getBlockTransfers.transfers !== null) {
            return this.getBlockTransfers.transfers
        }
        if (!this.isBlock && this.getAllEthTransfers && this.getAllEthTransfers.transfers !== null) {
            console.log(this.getAllEthTransfers)
            return this.getAllEthTransfers.transfers
        }
        return []
    }

    get message(): string {
        if (this.isBlock && this.transactions.length === 0) {
            return `${this.$t('message.tx.no-in-block')}`
        }
        return !this.transactions.length ? 'error' : ''
    }

    get isHome(): boolean {
        return this.pageType === 'home'
    }

    get isBlock(): boolean {
        return this.pageType === 'blockDetails'
    }

    get getTitle(): string {
        return this.isBlock ? `${this.$t('block.txs')}` : `${this.$t('tx.last')}`
    }
    get showPagination(): boolean {
        if (this.isHome) {
            return false
        }
        if (this.isBlock) {
            return this.totalPages > 1 ? true : false
        }

        return true
    }

    get loading(): boolean {
        if (this.isBlock || this.isHome) {
            return this.initialLoad
        }
        return this.$apollo.queries.getAllEthTransfers.loading
    }
    get hasMore(): boolean {
        if (!this.isHome && !this.isBlock) {
            return !(this.getAllEthTransfers.nextKey === null)
        }
        return false
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getAllEthTransfers.refetch()
        } else {
            if (!this.isBlock && page > this.isEnd && this.hasMore) {
                this.$apollo.queries.getAllEthTransfers.fetchMore({
                    variables: {
                        _limit: this.maxItems,
                        _nextKey: this.getAllEthTransfers.nextKey
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        this.isEnd = page
                        const newT = fetchMoreResult.getAllEthTransfers.transfers
                        const prevT = previousResult.getAllEthTransfers.transfers
                        return {
                            ...previousResult,
                            getAllEthTransfers: {
                                __typename: previousResult.getAllEthTransfers.__typename,
                                nextKey: fetchMoreResult.getAllEthTransfers.nextKey,
                                transfers: [...prevT, ...newT]
                            }
                        }
                    }
                })
            }
        }

        this.index = page
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('newBlock')
    onNewBlockChanged(newVal: number, oldVal: number): void {
        if (newVal != oldVal && this.isHome) {
            this.$apollo.queries.getAllEthTransfers.refresh()
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
