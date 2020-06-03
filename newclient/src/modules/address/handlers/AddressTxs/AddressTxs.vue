<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
            <!-- Notice new update-->
            <!-- <template v-slot:update >
                <notice-new-block @reload="setPage(0, true)" />
            </template> -->
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
            </template>
        </app-table-title>
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :table-message="message" :txs-data="transactions" :is-scroll-view="false">
            <template #header> <table-address-txs-header :address="address" /> </template>

            <template #rows>
                <v-card v-for="(tx, index) in transactions" :key="index" class="transparent" flat>
                    <table-address-txs-row :tx="tx" :is-pending="false" :address="address" />
                </v-card>
            </template>
        </table-txs>

        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
            <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
// import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getTxs_getEthTransfers as EthTransferType, getTxs as EthTransfersType } from './getTxs.type'
import { getTxs } from './transfers.graphql'
/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        AppPaginateHasMore,
        TableTxs,
        TableAddressTxsRow,
        TableAddressTxsHeader
    },
    apollo: {
        getEthTransfers: {
            query: getTxs,
            fetchPolicy: 'network-only',
            variables() {
                return {
                    hash: this.address,
                    _limit: this.maxItems,
                    _nextKey: null
                }
            },
            result({ data }) {
                if (data && data.getEthTransfers && data.getEthTransfers.transfers) {
                    this.error = '' // clear the error

                    if (this.initialLoad) {
                        console.log(data.getEthTransfers.nextKey)

                        this.showPagination = data.getEthTransfers.nextKey != null
                        this.initialLoad = false
                    }
                } else {
                    console.log('error failed no data: ', data)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                    this.$apollo.queries.getAllEthTransfers.refetch()
                }
            }
        }
    }
})
export default class AddressTxs extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop({ type: Boolean, default: false }) isPending!: boolean
    @Prop(String) address!: string

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    error = ''
    syncing?: boolean = false
    getEthTransfers!: EthTransferType
    initialLoad = true
    showPagination = false
    index = 0
    totalPages = 0
    isEnd = 0
    pageType = 'address'

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transactions(): any[] {
        if (this.getEthTransfers && this.getEthTransfers.transfers !== null) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getEthTransfers.transfers.length ? this.getEthTransfers.transfers.length : start + this.maxItems
            return this.getEthTransfers.transfers.slice(start, end)
        }
        return []
    }

    get message(): string {
        if (this.getEthTransfers && this.getEthTransfers.transfers.length === 0) {
            return `${this.$t('message.tx.no-all')}`
        }
        if (this.error) {
            return this.error
        }
        return ''
    }

    get getTitle(): string {
        return this.isPending ? `${this.$t('block.txs')}` : `${this.$t('tx.last')}`
    }

    get loading(): boolean {
        return this.$apollo.queries.getEthTransfers.loading
    }
    get hasMore(): boolean {
        return this.getEthTransfers && this.getEthTransfers.nextKey != null
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getEthTransfers.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                this.$apollo.queries.getEthTransfers.fetchMore({
                    variables: {
                        hash: this.address,
                        _limit: this.maxItems,
                        _nextKey: this.getEthTransfers.nextKey
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        this.isEnd = page
                        const newT = fetchMoreResult.getEthTransfers.transfers
                        const prevT = previousResult.getEthTransfers.transfers
                        return {
                            ...previousResult,
                            getEthTransfers: {
                                __typename: previousResult.getEthTransfers.__typename,
                                nextKey: fetchMoreResult.getEthTransfers.nextKey,
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
    // @Watch('newBlock')
    // onNewBlockChanged(newVal: number, oldVal: number): void {
    //     if (newVal != oldVal && this.isHome) {
    //         this.$apollo.queries.getAllEthTransfers.refresh()
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
