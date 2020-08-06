<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
            <!-- Notice new update-->
            <template v-slot:update v-if="!initialLoad">
                <app-new-update :text="updateText" :update-count="newTransfers" @reload="setPage(0, true)" />
            </template>
            <template v-slot:pagination v-if="!isETH && showPagination && !initialLoad">
                <app-paginate-has-more
                    v-if="showPagination && !initialLoad"
                    :class="$vuetify.breakpoint.smAndDown ? 'pt-3' : ''"
                    :has-more="hasMore"
                    :current-page="index"
                    :loading="loading"
                    @newPage="setPage"
                />
            </template>
        </app-table-title>
        <v-layout
            v-if="isETH"
            :column="$vuetify.breakpoint.smAndDown"
            :align-center="$vuetify.breakpoint.mdAndUp"
            :align-baseline="$vuetify.breakpoint.smAndDown"
            d-flex
            justify-space-between
            wrap
            pa-3
        >
            <v-layout align-center px-2>
                <p class="pr-2 info--text">{{ $t('filter.name') }}</p>
                <v-card flat class="tx-filter-select-container pl-2" height="36px">
                    <v-select
                        v-model="filter"
                        :items="options"
                        solo
                        flat
                        hide-details
                        class="primary body-1"
                        item-text="text"
                        item-value="value"
                        height="32px"
                    />
                </v-card>
            </v-layout>

            <app-paginate-has-more
                v-if="showPagination && !initialLoad"
                :class="$vuetify.breakpoint.smAndDown ? 'pt-3' : ''"
                :has-more="hasMore"
                :current-page="index"
                :loading="loading"
                @newPage="setPage"
            />
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :table-message="message" :txs-data="transfers" :is-scroll-view="false">
            <template #header>
                <table-address-txs-header v-if="isETH" :address="address" />
                <table-address-tokens-header v-else :is-erc20="isERC20" :is-transfers="true" />
            </template>
            <template #rows>
                <v-card v-for="(tx, index) in transfers" :key="index" class="transparent" flat>
                    <table-address-txs-row v-if="isETH" :transfer="tx" :is-pending="false" :address="address" />
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
import AppNewUpdate from '@app/core/components/ui/AppNewUpdate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getAdrEthTransfers, getAdrERC20Transfers, getAdrERC721Transfers } from './transfers.graphql'
import { getAdrEthTransfers_getEthTransfersV2 as EthTransfersType } from './apolloTypes/getAdrEthTransfers'
import { getAdrERC20Transfers_getERC20Transfers as ERC20TransfersType } from './apolloTypes/getAdrErc20Transfers'
import { getAdrERC721Transfers_getERC721Transfers as ERC721TransfersType } from './apolloTypes/getAdrERC721Transfers'
import { AddressEventType } from '@app/apollo/global/globalTypes'
import { EthTransfer } from '@app/modules/address/models/EthTransfer'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppNewUpdate,
        AppTableTitle,
        AppPaginateHasMore,
        TableTxs,
        TableAddressTxsRow,
        TableAddressTxsHeader,
        TableAddressTokensHeader,
        TableAddressTransfersRow
    },
    apollo: {
        getTransfers: {
            query() {
                if (this.isETH) {
                    return getAdrEthTransfers
                }
                return this.isERC20 ? getAdrERC20Transfers : getAdrERC721Transfers
            },
            fetchPolicy: 'network-only',
            variables() {
                return {
                    hash: this.address,
                    filter: this.filter,
                    _limit: this.maxItems
                }
            },
            deep: true,
            update: data => data.getEthTransfersV2 || data.getERC20Transfers || data.getERC721Transfers,
            result({ data }) {
                if (this.hasTransfers) {
                    this.error = '' // clear the error
                    if (data.getEthTransfersV2 && data.getEthTransfersV2.transfers) {
                        this.ethTransfers = data.getEthTransfersV2.transfers.map(item => {
                            return new EthTransfer(item)
                        })
                    }
                    if (this.initialLoad) {
                        this.showPagination = this.getTransfers.nextKey != null
                        this.initialLoad = false
                    }
                } else {
                    console.log('error failed no data: ', data)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
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
    @Prop(Number) newTransfers!: number
    @Prop(Boolean) refetchTransfers?: boolean

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
    filter = null
    getTransfers!: EthTransfersType | ERC20TransfersType | ERC721TransfersType
    ethTransfers!: EthTransfer[]

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transfers(): any[] {
        if (this.hasTransfers) {
            console.error('address transfer', this.getTransfers)
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getTransfers.transfers.length ? this.getTransfers.transfers.length : start + this.maxItems
            if (this.isETH) {
                return this.ethTransfers.slice(start, end)
            }
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
        return this.$apollo.queries.getTransfers.loading || this.initialLoad
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

    get options() {
        return [
            {
                text: this.$i18n.t('filter.all'),
                value: null
            },
            {
                text: this.$i18n.t('filter.in'),
                value: 'TO'
            },
            {
                text: this.$i18n.t('filter.out'),
                value: 'FROM'
            }
        ]
    }
    get eventType(): AddressEventType {
        return this.isETH ? AddressEventType.NEW_ETH_TRANSFER : this.isERC20 ? AddressEventType.NEW_ERC20_TRANSFER : AddressEventType.NEW_ERC721_TRANSFER
    }

    get updateText(): string {
        const plural = this.newTransfers > 1 ? 2 : 1
        return this.isETH
            ? `${this.$tc('message.update.tx', plural)}`
            : this.isERC20
            ? `${this.$tc('message.update.erc20-transfer', plural)}`
            : `${this.$tc('message.update.erc721-transfer', plural)}`
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.initialLoad = true
            this.showPagination = false
            if (this.isETH) {
                this.$apollo.queries.getTransfers.refetch()
            }
            this.$emit('resetUpdateCount', this.eventType, true)
        } else {
            if (page > this.isEnd && this.hasMore) {
                let queryName!: string
                if (this.isETH) {
                    queryName = 'getEthTransfersV2'
                } else {
                    queryName = this.isERC20 ? 'getERC20Transfers' : 'getERC721Transfers'
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
                            [queryName]: {
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

    @Watch('refetchTransfers')
    onRefetchTransfersChanged(newVal: boolean, oldVal: boolean): void {
        if (newVal && newVal !== oldVal) {
            if (!this.isETH) {
                this.isEnd = 0
                this.initialLoad = true
                this.showPagination = false
                this.$apollo.queries.getTransfers
                    .refetch()
                    .then(data => {
                        if (data) {
                            this.$emit('resetTransfersRefetch')
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
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
