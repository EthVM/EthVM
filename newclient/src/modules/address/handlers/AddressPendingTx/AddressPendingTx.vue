<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :has-pagination="showPagination" :title="getTitle" :page-type="pageType" page-link="">
            <template v-slot:pagination v-if="showPagination">
                <app-paginate-has-more
                    v-if="showPagination"
                    :class="$vuetify.breakpoint.smAndDown ? 'pt-3' : ''"
                    :has-more="hasMore"
                    :current-page="index"
                    :loading="loading"
                    @newPage="setPage"
                />
            </template>
        </app-table-title>
        <table-txs :is-loading="loading" :table-message="message" :txs-data="getPendingTx" :is-scroll-view="false">
            <template #header>
                <table-address-txs-header :address="address" />
            </template>
            <template #rows>
                <v-card v-for="(tx, index) in getPendingTx" :key="index" class="transparent" flat>
                    <table-address-txs-row :is-pending="true" :tx="tx" :address="address" />
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
import { getPendingTransactions } from './pendingTxs.graphql'
import { getPendingTransactions as PendingTxType } from './apolloTypes/getPendingTransactions'

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
            update: data => data.getPendingTransactions
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
    totalPages = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    showPagination = true
    pageType = 'address'
    getPendingTx!: PendingTxType[]

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get pendingTx(): any[] {
        if (!this.loading && this.getPendingTx) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getPendingTx.length ? this.pendingTx.length : start + this.maxItems
            return this.pendingTx.slice(start, end)
        }
        return []
    }

    get getTitle(): string {
        return `${this.$tc('tx.pending', 2)}`
    }

    get loading(): boolean {
        return this.$apollo.queries.getPendingTx.loading
    }

    get message(): string {
        if (!this.loading && this.getPendingTx && this.getPendingTx.length === 0) {
            return `${this.$t('message.tx.no-pending')}`
        }
        return ''
    }
}
</script>
