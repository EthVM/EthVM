<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="$tc('tx.pending', 2)" :has-pagination="showPagination" page-type="pending" page-link="/pending-txs">
            <template v-if="showPagination && !initialLoad" #pagination>
                <app-paginate :total="totalPages" :current-page="index" :has-input="false" :has-first="true" :has-last="true" @newPage="setPage" />
            </template>
        </app-table-title>
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
            <app-paginate :total="totalPages" :current-page="index" :has-input="false" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { pendingTx, txMined } from './pendingTxs.graphql'
import { PendingTx } from '@app/modules/txs/components/props'
import { ErrorMessagePendingTx } from '@app/modules/txs/models/ErrorMessagesForTx'

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        TableTxs
    },
    apollo: {
        $subscribe: {
            NewPendingTx: {
                query: pendingTx,
                result({ data }) {
                    if (this.initialLoad) {
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
    hasError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get totalPages(): number {
        if (this.pendingTxs.length > 0) {
            return Math.ceil(new BN(this.pendingTxs.length).div(this.maxItems).toNumber())
        }
        return 0
    }

    get message(): string {
        if (this.loading) {
            return ''
        }
        if (!this.initialLoad && this.pendingTxs.length === 0) {
            return `${this.$t('message.tx.no-pen')}`
        }
        return ''
    }

    get showPagination(): boolean {
        return this.totalPages > 1
    }

    get loading(): boolean {
        if (this.hasError) {
            return true
        }
        return this.pendingTxs.length === 0
    }
    get hasMore(): boolean {
        return this.index + 1 < this.totalPages
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    markMined(hash: string): void {
        let index = this.pendingTxs.findIndex(tx => tx.transactionHash === hash)
        if (this.pendingTxs[index]) {
            this.pendingTxs[index].isMined = true
        }
        setTimeout(() => {
            index = this.pendingTxs.findIndex(tx => tx.transactionHash === hash)
            if (index >= 0) {
                this.pendingTxs.splice(index, 1)
                if (this.totalPages < this.index + 1) {
                    this.index = this.totalPages - 1
                }
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
                    this.markMined(_hash)
                    a.unsubscribe()
                },
                error: error => {
                    this.emitErrorState(true)
                }
            })
        } else {
            console.log('not defined', _hash)
        }
    }

    setPage(page: number): void {
        if (page < this.index || this.hasMore) {
            this.index = page
        }
    }

    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorDetails', this.hasError, ErrorMessagePendingTx.details)
    }
}
</script>
