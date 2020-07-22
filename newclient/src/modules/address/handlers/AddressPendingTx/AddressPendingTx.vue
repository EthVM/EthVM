<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :has-pagination="hasMore" :title="getTitle" :page-type="pageType" page-link="">
            <template v-slot:pagination v-if="hasMore">
                <app-paginate-has-more
                    v-if="hasMore"
                    :class="$vuetify.breakpoint.smAndDown ? 'pt-3' : ''"
                    :has-more="hasMore"
                    :current-page="index"
                    :loading="loading"
                    @newPage="setPage"
                />
            </template>
        </app-table-title>
        <table-txs :is-loading="loading" :table-message="message" :txs-data="pendingTx" :is-scroll-view="false">
            <template #header>
                <table-address-txs-header :address="address" :is-pending="true" />
            </template>
            <template #rows>
                <v-card v-for="(tx, index) in pendingTx" :key="index" class="transparent" flat>
                    <table-address-txs-row :is-pending="true" :transfer="tx" :address="address" />
                </v-card>
            </template>
        </table-txs>
    </v-card>
</template>

<script lang="ts">
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getPendingTransactions, pendingTransaction } from './pendingTxs.graphql'
import { getPendingTransactions_getPendingTransactions as PendingTxType } from './apolloTypes/getPendingTransactions'
import { pendingTransaction_pendingTransaction as PendingTransferType } from './apolloTypes/pendingTransaction'
import { EthTransfer } from '@app/modules/address/models/EthTransfer'

interface PendingMap {
    [key: string]: EthTransfer
}

@Component({
    components: {
        AppTableTitle,
        TableTxs,
        TableAddressTxsRow,
        TableAddressTxsHeader,
        TableAddressTokensHeader,
        TableAddressTransfersRow,
        AppPaginateHasMore
    },
    apollo: {
        getPendingTx: {
            query: getPendingTransactions,
            variables() {
                return {
                    hash: this.address
                }
            },
            update: data => data.getPendingTransactions,
            // subscribeToMore: {
            //     document: pendingTransaction,
            //     variables() {
            //         return {
            //             owner: this.address
            //         }
            //     },
            //     updateQuery: (previousResult, { subscriptionData }) => {
            //         console.log(subscriptionData)
            //         return
            //         // if (previousResult && subscriptionData.data.pendingTransaction) {
            //         //     const prevB = previousResult.getBlocksArrayByNumber
            //         //     const newB = subscriptionData.data.newBlockFeed
            //         //     newB.txFail = 0
            //         //     const index = prevB.findIndex(block => block.number === newB.number)
            //         //     if (index != -1) {
            //         //         prevB[index] = newB
            //         //         return previousResult
            //         //     }
            //         //     return {
            //         //         __typename: 'BlockSummary',
            //         //         getBlocksArrayByNumber: [newB, ...prevB]
            //         //     }
            //         // }
            //     }
            // },
            result({ data }) {
                this.error = ''
                this.getPendingTx.forEach(i => {
                    this.pendingMap[i.hash] = new EthTransfer(i)
                })
                if (this.initialLoad) {
                    this.initialLoad = false
                    console.log(this.initialLoad)
                }
            }
        },
        $subscribe: {
            pendingTransaction: {
                query: pendingTransaction,
                variables() {
                    return {
                        owner: this.address
                    }
                },
                // skip() {
                //     return this.initialLoad
                // },
                result({ data }) {
                    console.log(data)
                },
                error(error) {
                    console.error(error)
                }
            }
        }
    }
})
export default class AddressPendingTx extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Number) maxItems!: number
    @Prop(String) address!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    index = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    pageType = 'address'
    getPendingTx!: PendingTxType[]
    error = ''
    pendingMap: PendingMap = {}
    initialLoad = true
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get pendingTx(): EthTransfer[] {
        if (!this.loading && this.getPendingTx) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getPendingTx.length ? this.getPendingTx.length : start + this.maxItems
            const transfers = this.getPendingTx.slice(start, end).map(i => {
                return this.pendingMap[i.hash]
            })
            return transfers
        }
        return []
    }

    get getTitle(): string {
        return `${this.$tc('tx.pending', 2)}`
    }

    get loading(): boolean {
        return this.$apollo.queries.getPendingTx.loading || this.initialLoad
    }

    get message(): string {
        if (!this.loading && this.getPendingTx && this.getPendingTx.length === 0) {
            return `${this.$t('message.tx.no-pending')}`
        }
        return ''
    }

    get totalPages(): number {
        if (this.getPendingTx) {
            return Math.ceil(new BN(this.getPendingTx.length).div(this.maxItems).toNumber())
        }
        return 0
    }

    get hasMore(): boolean {
        return this.isEnd + 1 < this.totalPages
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
        } else {
            if (page > this.isEnd && this.hasMore) {
                this.isEnd = page
            }
        }
        this.index = page
    }
}
</script>
