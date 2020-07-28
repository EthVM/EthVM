<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :has-pagination="showPagination" :title="getTitle" :page-type="pageType" page-link="">
            <template v-slot:pagination v-if="showPagination">
                <app-paginate-has-more
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
import { throwError } from 'rxjs'
import { networkInterfaces } from 'os'

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
            deep: true,
            update: data => {
                return data.getPendingTransactions
            },
            result({ data }) {
                this.error = ''
                if (this.initialLoad) {
                    this.pendingSorted = this.getPendingTx.sort((x, y) => (y.timestamp < x.timestamp ? -1 : y.timestamp > x.timestamp ? 1 : 0))
                    this.getPendingTx.forEach(i => {
                        this.pendingMap[i.hash] = new EthTransfer(i)
                    })
                    this.initialLoad = false
                }
            }
        },
        $subscribe: {
            newPendingTransfer: {
                query: pendingTransaction,
                variables() {
                    return {
                        owner: this.address
                    }
                },
                skip() {
                    return this.loading
                },
                result({ data }) {
                    const newTx = data.pendingTransaction
                    this.pendingMap[newTx.transactionHash] = new EthTransfer(newTx)
                    this.insertItem(newTx, this.pendingSorted)
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
    pendingSorted!: (PendingTransferType | PendingTxType)[]
    error = ''
    pendingMap: PendingMap = {}
    initialLoad = true
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get pendingTx(): EthTransfer[] {
        if (!this.loading && this.pendingSorted) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getPendingTx.length ? this.pendingSorted.length : start + this.maxItems
            return this.pendingSorted.slice(start, end).map(i => {
                const hash = i.__typename === 'Tx' ? i.hash : i.transactionHash
                return this.pendingMap[hash]
            })
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

    get showPagination(): boolean {
        return this.totalPages > 1
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

    /*
    Desc: This method inserts new transfer into an array in sorted manner.
    Assumptions:
        - Array is already presorted.
        - Most of the new pending transfers will come as soon as they are seen and processed, according to the timestamp.
        - Case I: if first item in the array, has smaller timestamp item will be inserted in front of the array
        - Case II: Items can come in unsorted, as this depends on how busy the account is; in this case binary index search will be performed and item will be inserted accordignly
     */
    insertItem(item: PendingTransferType, transfers: (PendingTransferType | PendingTxType)[]): void {
        const itemTime = item.timestamp
        if (transfers.length === 0) {
            transfers.push(item)
        } else if (transfers[0].timestamp !== null && transfers[0].timestamp <= itemTime) {
            transfers.unshift(item)
        } else {
            let searchIndex = true
            let start = 0
            let end = transfers.length
            while (searchIndex) {
                const mIndex = new BN(end + start).idiv(2).toNumber()
                const midTime = transfers[mIndex].timestamp
                if (midTime === null) {
                    end === transfers.length
                    searchIndex = false
                } else if (end - start === 1) {
                    searchIndex = false
                } else {
                    if (midTime === itemTime) {
                        end = mIndex
                        searchIndex = false
                    } else if (midTime < itemTime) {
                        end = mIndex
                    } else {
                        start = mIndex
                    }
                }
            }
            const startA = transfers.slice(0, end)
            const startB = transfers.slice(end, transfers.length)
            transfers = [...startA, item, ...startB]
        }
    }
}
</script>
