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
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :table-message="message" :txs-data="transfers" :is-scroll-view="false">
            <template #header>
                <table-address-txs-header v-if="isETH" :address="address" />
                <table-address-transfers-header v-else :is-erc20="isERC20" />
            </template>
            <template #rows>
                <v-card v-for="(tx, index) in transfers" :key="index" class="transparent" flat>
                    <table-address-txs-row v-if="isETH" :tx="tx" :is-pending="false" :address="address" />
                    <table-address-transfers-row v-else :transfer="tx" :is-erc20="isERC20" :address="address" />
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
import TableAddressTransfersHeader from '@app/modules/address/components/TableAddressTransfersHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getEthTransfers, getERC20Transfers } from './transfers.graphql'
import { getEthTransfers_getEthTransfers as EthTransfersType } from './getEthTransfers.type'
import { getERC20Transfers_getERC20Transfers as ERC20TransfersType } from './getERC20Transfers.type'
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
        TableAddressTxsHeader,
        TableAddressTransfersHeader,
        TableAddressTransfersRow
    },
    apollo: {
        getTransfers: {
            query() {
                return this.isETH ? getEthTransfers : getERC20Transfers
            },
            fetchPolicy: 'network-only',
            variables() {
                return {
                    hash: this.address,
                    _limit: this.maxItems
                }
            },
            deep: true,
            update: data => data.getEthTransfers || data.getERC20Transfers,
            result({ data }) {
                if (this.hasTransfers) {
                    console.log(this.getTransfers)
                    this.error = '' // clear the error
                    if (this.initialLoad) {
                        this.showPagination = this.getTransfers.nextKey != null
                        this.initialLoad = false
                    }
                } else {
                    console.log('error failed no data: ', data)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                    this.$apollo.queries.getTransfers.refetch()
                }
            }
        }
    }
})
export default class AddressTransers extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop({ type: Boolean, default: false }) isPending!: boolean
    @Prop(String) address!: string
    @Prop({ type: String, default: 'eth' }) transfersType!: string

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    error = ''
    syncing?: boolean = false
    initialLoad = true
    showPagination = false
    index = 0
    totalPages = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    pageType = 'address'
    getTransfers!: EthTransfersType | ERC20TransfersType

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transfers(): any[] {
        if (!this.loading && this.hasTransfers) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getTransfers.transfers.length ? this.getTransfers.transfers.length : start + this.maxItems
            return this.getTransfers.transfers.slice(start, end)
        }
        return []
    }

    get message(): string {
        if (!this.loading && this.hasTransfers && this.getTransfers.transfers.length === 0) {
            if (this.isETH) {
                return `${this.$t('message.tx.no-all')}`
            }
            return `${this.$t('message.transfer.no-all')}`
        }
        if (this.error != '') {
            return this.error
        }
        return ''
    }

    get getTitle(): string {
        if (this.isETH) {
            return !this.isPending ? `${this.$t('tx.last')}` : `${this.$t('tx.pendign')}`
        }
        if (this.isERC20) {
            return `${this.$t('transfer.erc20')}`
        }
        return `${this.$t('transfer.erc721')}`
    }

    get loading(): boolean {
        return this.$apollo.queries.getTransfers.loading
    }
    get hasMore(): boolean {
        return this.getTransfers && this.getTransfers.nextKey != null
    }
    get hasTransfers(): boolean {
        return this.getTransfers && this.getTransfers.transfers != null
    }

    get isETH(): boolean {
        return this.transfersType === 'eth'
    }

    get isERC20(): boolean {
        return this.transfersType === 'ERC20'
    }

    get NFT(): boolean {
        return this.transfersType === 'ERC721'
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getTransfers.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                let queryName!: string
                if (this.isETH) {
                    queryName = 'getEthTransfers'
                } else {
                    queryName = 'getERC20Transfers'
                }

                this.$apollo.queries.getTransfers.fetchMore({
                    variables: {
                        hash: this.address,
                        _limit: this.maxItems,
                        _nextKey: this.getTransfers.nextKey
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        this.isEnd = page
                        const newT = fetchMoreResult[queryName].transfers
                        const prevT = previousResult[queryName].transfers
                        return {
                            getEthTransfers: {
                                nextKey: fetchMoreResult[queryName].nextKey,
                                transfers: [...prevT, ...newT],
                                __typename: fetchMoreResult[queryName].__typename
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
