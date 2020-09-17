<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="$tc('tx.pending', 2)" :has-pagination="showPagination" page-type="pending" page-link="/pending-txs">
            <!-- <template v-slot:update v-if="!isHome && !isBlock">
                <app-new-update :text="$t('message.update.txs')" :update-count="newMinedTransfers" :hide-count="true" @reload="setPage(0, true)" />
            </template> -->
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" /></template
        ></app-table-title>
        <table-txs
            :max-items="maxItems"
            :index="index"
            :is-loading="loading"
            :table-message="message"
            :txs-data="pendingTxs"
            :is-scroll-view="false"
            :pending="true"
        />
        <v-layout
            v-if="showPagination && !initialLoad"
            :justify-end="$vuetify.breakpoint.mdAndUp"
            :justify-center="$vuetify.breakpoint.smAndDown"
            row
            class="pb-1 pr-3 pl-2"
        >
            <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppNewUpdate from '@app/core/components/ui/AppNewUpdate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { pendingTx, txMined } from './pendingTxs.graphql'
import { PendingTx } from '@app/modules/txs/components/props'
// import { pendingTx_pendingTransaction as PendingTxType } from './apolloTypes/pendingTx'
// import { TransferType } from '@app/apollo/global/globalTypes'
// import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        AppPaginateHasMore,
        AppNewUpdate,
        TableTxs
    },
    apollo: {
        $subscribe: {
            NewPendingTx: {
                query: pendingTx,
                result({ data }) {
                    if (this.initalLoad) {
                        this.initialLoad = false
                    }
                    if (data.pendingTransaction) {
                        data.pendingTransaction.isMined = false
                        this.createSubscription(data.pendingTransaction.transactionHash)
                        this.pendingTxs.push(data.pendingTransaction)
                    }
                },
                error(error) {
                    this.emitErrorState(true)
                }
            }
        }
    }
})
export default class PendingTxs extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */
    pendingTxs: PendingTx[] = []
    initialLoad = true
    index = 0
    totalPages = 0
    isEnd = 0
    newMinedTransfers = 0
    hasError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    // get transactions(): (TypeTransfers | null)[] | [] {
    //     if (this.isBlock && this.getBlockTransfers && this.getBlockTransfers.transfers !== null) {
    //         return this.getBlockTransfers.transfers
    //     }
    //     if (!this.isBlock && this.getAllEthTransfers && this.getAllEthTransfers.transfers !== null) {
    //         return this.getAllEthTransfers.transfers
    //     }
    //     return []
    // }

    get message(): string {
        if (this.loading) {
            return ''
        }
        // if (this.isBlock && this.transactions.length === 0) {
        //     return `${this.$t('message.tx.no-in-block')}`
        // }
        return ''
    }

    // get isHome(): boolean {
    //     return this.pageType === 'home'
    // }

    // get isBlock(): boolean {
    //     return this.pageType === 'blockDetails'
    // }
    // get skipBlockTxs(): boolean {
    //     return !(this.isBlock && this.isMined)
    // }

    // get getTitle(): string {
    //     return this.isBlock ? `${this.$t('block.txs')}` : `${this.$tc('tx.last', 1)}`
    // }
    get showPagination(): boolean {
        return this.hasMore
    }

    get loading(): boolean {
        if (this.hasError) {
            return true
        }
        return this.pendingTxs.length === 0
    }
    get hasMore(): boolean {
        if (this.pendingTxs.length > this.maxItems) {
            return true
        }
        return false
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    markMined(hash: string): void {
        const index = this.pendingTxs.findIndex(tx => tx.transactionHash === hash)
        this.pendingTxs[index].isMined = true
        console.error('this', this.pendingTxs[index])
        setTimeout(() => {
            if (index >= 0) {
                this.pendingTxs.splice(index, 1)
            }
        }, 10000)
    }

    createSubscription(_hash: string): void {
        if (_hash) {
            const observer = this.$apollo.subscribe({
                query: txMined,
                variables: {
                    hash: _hash
                }
            })
            const a = observer.subscribe({
                next: data => {
                    console.error('data', data)
                    this.markMined(_hash)
                    a.unsubscribe()
                },
                error: error => {
                    console.error('error', error)
                    this.emitErrorState(true)
                }
            })
        } else {
            console.log('not defined', _hash)
        }
    }

    // setPage(page: number, reset: boolean = false): void {
    //     if (reset) {
    //         this.isEnd = 0
    //         if (!this.isHome && !this.isBlock) {
    //             this.newMinedTransfers = 0
    //         }
    //         this.$apollo.queries.getAllEthTransfers.refetch()
    //     } else {
    //         if (!this.isBlock && page > this.isEnd && this.hasMore) {
    //             this.$apollo.queries.getAllEthTransfers.fetchMore({
    //                 variables: {
    //                     _limit: this.maxItems,
    //                     _nextKey: this.getAllEthTransfers.nextKey
    //                 },
    //                 updateQuery: (previousResult, { fetchMoreResult }) => {
    //                     this.isEnd = page
    //                     const newT = fetchMoreResult.getAllEthTransfers.transfers
    //                     const prevT = previousResult.getAllEthTransfers.transfers
    //                     return {
    //                         ...previousResult,
    //                         getAllEthTransfers: {
    //                             __typename: previousResult.getAllEthTransfers.__typename,
    //                             nextKey: fetchMoreResult.getAllEthTransfers.nextKey,
    //                             transfers: [...prevT, ...newT]
    //                         }
    //                     }
    //                 }
    //             })
    //         }
    //     }

    //     this.index = page
    // }
    emitErrorState(val: boolean): void {
        this.hasError = val
        // this.$emit('errorTxs', this.hasError, ErrorMessageBlock.blockTxs)
    }
    /*
    ===================================================================================
      Watch:
    ===================================================================================
    */
    // @Watch('blockRef')
    // onBlockRefChanged(newVal: string, oldVal: string) {
    //     if (newVal !== oldVal) {
    //         this.initialLoad = true
    //         this.hasError = false
    //     }
    // }
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
