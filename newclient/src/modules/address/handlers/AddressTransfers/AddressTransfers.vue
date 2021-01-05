<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
            <!-- Notice new update-->
            <template v-if="!initialLoad" #update>
                <app-new-update :text="updateText" :update-count="newTransfers" @reload="setPage(0, true)" />
            </template>
            <template v-if="!isETH && showPagination && !initialLoad" #pagination>
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
        <v-layout v-if="isETH" :column="$vuetify.breakpoint.xs" :align-center="true" d-flex justify-space-between wrap pa-3>
            <app-filter
                v-if="((!initialLoad && getTransfers.transfers.length > 0) || filter)"
                :options="options"
                :show-desktop="true"
                :is-sort="false"
                @onSelectChange="onFilterChange"
            />
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
                    <table-address-txs-row
                        v-if="isETH"
                        :transfer="tx"
                        :is-pending="false"
                        :address="address"
                        :get-state-diff="getStateDiff"
                        :loading-state-diff="loadingStateDiff"
                    />
                    <table-address-transfers-row v-else :transfer="tx" :is-erc20="isERC20" :address="address" :token-image="getImg(tx.contract)" />
                </v-card>
            </template>
        </table-txs>
        <v-layout
            v-if="showPagination && !initialLoad"
            :justify-end="$vuetify.breakpoint.mdAndUp"
            :justify-center="$vuetify.breakpoint.smAndDown"
            row
            class="pb-3 pr-3 pl-2"
        >
            <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppFilter from '@app/core/components/ui/AppFilter.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppNewUpdate from '@app/core/components/ui/AppNewUpdate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'
import { Component, Prop, Watch, Vue, Mixins } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getAddressEthTransfers, getAddressERC20Transfers, getAddressERC721Transfers, getTransactionStateDiff } from './transfers.graphql'
import { getAddressEthTransfers_getEthTransfersV2 as EthTransfersType } from './apolloTypes/getAddressEthTransfers'
import { getAddressERC20Transfers_getERC20Transfers as ERC20TransfersType } from './apolloTypes/getAddressERC20Transfers'
import { getAddressERC721Transfers_getERC721Transfers as ERC721TransfersType } from './apolloTypes/getAddressERC721Transfers'
import { AddressEventType } from '@app/apollo/global/globalTypes'
import { EthTransfer } from '@app/modules/address/models/EthTransfer'
import { ErrorMessage } from '../../models/ErrorMessagesForAddress'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { excpInvariantViolation } from '@app/apollo/exceptions/errorExceptions'

const TYPES = ['in', 'out', 'self']

@Component({
    components: {
        AppNewUpdate,
        AppTableTitle,
        AppFilter,
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
                    return getAddressEthTransfers
                }
                return this.isERC20 ? getAddressERC20Transfers : getAddressERC721Transfers
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
                    try {
                        if (data.getEthTransfersV2 && data.getEthTransfersV2.transfers) {
                            this.ethTransfers = data.getEthTransfersV2.transfers.map(item => {
                                return new EthTransfer(item)
                            })
                        }
                        if (this.initialLoad) {
                            this.showPagination = this.getTransfers.nextKey != null
                            this.initialLoad = false
                        }
                        this.emitErrorState(false)
                    } catch (error) {
                        this.initialLoad = true
                        this.emitErrorState(true)
                        throw error
                    }
                }
            },
            error(error) {
                this.emitErrorState(true)
                this.showPagination = false
                this.initialLoad = true
            }
        }
    }
})
export default class AddressTransers extends Mixins(CoinData) {
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
    @Prop(Boolean) isContract?: boolean
    @Prop(Boolean) loadingContract?: boolean

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    syncing?: boolean = false
    initialLoad = true
    showPagination = false
    filter = null
    index = 0
    totalPages = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    pageType = 'address'
    getTransfers!: EthTransfersType | ERC20TransfersType | ERC721TransfersType
    ethTransfers!: EthTransfer[]
    hasError = false
    loadingStateDiff = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transfers(): any[] {
        if (this.hasTransfers) {
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
        return ''
    }

    get getTitle(): string {
        if (this.isETH) {
            return !this.isPending ? `${this.$tc('tx.last', 2)}` : `${this.$t('tx.pending')}`
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

    get tokenImg(): Map<string, TokenMarketData> | false {
        if (!this.initialLoad && this.isERC20) {
            const contracts: string[] = []
            this.getTransfers.transfers.forEach(token => {
                contracts.push(token.contract)
            })
            if (contracts.length > 0) {
                return this.getEthereumTokensMap(contracts)
            }
        }
        return false
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */
    /**
     * Fetches image for the contract
     * @param contract {String}
     * @returns {TokenMarketData} or {undefined}
     */
    getImg(contract: string): TokenMarketData | undefined {
        if (!this.initialLoad && this.tokenImg && this.tokenImg.has(contract) && this.isERC20) {
            const token = this.tokenImg.get(contract)
            return this.tokenImg.get(contract)
        }
        return undefined
    }
    /**
     * Filter on change call back
     */
    onFilterChange(filter: any) {
        this.setPage(0, true)
        this.filter = filter
    }
    /**
     * Sets page or reset
     * @params page {Number} reset {Boolean}
     */
    async setPage(page: number, reset: boolean = false): Promise<boolean> {
        try {
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
                    await this.$apollo.queries.getTransfers.fetchMore({
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
            return true
        } catch (e) {
            const newE = JSON.stringify(e)
            if (!newE.toLowerCase().includes(excpInvariantViolation)) {
                throw new Error(newE)
            }
            return false
        }
    }
    /**
     * Emit error to Sentry
     * @param val {Boolean}
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        const errorType = this.isETH ? ErrorMessage.transfersETH : this.isERC20 ? ErrorMessage.transfersERC20 : ErrorMessage.transfersERC721
        this.$emit('errorTransfers', this.hasError, errorType)
    }

    /**
     * Get state diff if transaction has failed
     * @param _hash {String}
     * @param _type {String}
     */
    getStateDiff(_hash: string, _type: string): void {
        this.loadingStateDiff = true
        this.$apollo
            .query({
                query: getTransactionStateDiff,
                variables: {
                    hash: _hash
                }
            })
            .then(response => {
                if (response && response.data) {
                    const transferIdx = this.transfers.findIndex(t => {
                        return t.transfer.transfer.transactionHash === _hash
                    })
                    const stateDiffIdx = response.data.getTransactionStateDiff.findIndex(state => {
                        return state.owner.toLowerCase() === this.address.toLowerCase()
                    })
                    if (transferIdx > -1 && stateDiffIdx > -1) {
                        this.transfers[transferIdx].stateDiff = Object.assign({}, this.transfers[transferIdx].stateDiff, {
                            from: {
                                before: _type === TYPES[1] ? response.data.getTransactionStateDiff[stateDiffIdx].from : '',
                                after: _type === TYPES[1] ? response.data.getTransactionStateDiff[stateDiffIdx].to : ''
                            },
                            to: {
                                before: _type === TYPES[0] ? response.data.getTransactionStateDiff[stateDiffIdx].from : '',
                                after: _type === TYPES[0] ? response.data.getTransactionStateDiff[stateDiffIdx].to : ''
                            }
                        })
                    } else if (stateDiffIdx < 0 && !this.isContract && !this.loadingContract) {
                        throw new Error('No state diff found for regular address')
                    }
                }
                this.loadingStateDiff = false
            })
            .catch(error => {
                throw error
            })
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
                        this.emitErrorState(true)
                    })
            }
        }
    }
}
</script>
<style scoped lang="css">
.tx-status {
    min-width: 60px;
}
</style>
