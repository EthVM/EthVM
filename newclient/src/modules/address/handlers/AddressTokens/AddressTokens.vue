<template>
    <v-card color="white" flat class="pb-2">
        <div v-if="!showUniqueNFT">
            <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
                <!-- Notice new update-->
                <template v-slot:update v-if="!loading">
                    <app-new-update :text="updateText" :update-count="newTokens" :hide-count="true" @reload="setPage(0, true)" />
                </template>
                <template v-slot:pagination v-if="showPagination && !loading">
                    <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
                </template>
            </app-table-title>
            <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :table-message="message" :txs-data="tokens" :is-scroll-view="false">
                <template #header>
                    <table-address-tokens-header :is-erc20="isERC20" :is-transfers="false" />
                </template>
                <template #rows>
                    <v-card v-for="(token, index) in tokens" :key="index" class="transparent" flat>
                        <table-address-tokens-row
                            v-if="!loading"
                            :token="token"
                            :is-erc20="isERC20"
                            :holder="address"
                            :token-price-info="getUSDInfo(token.tokenInfo.contract)"
                            :nft-meta="getContractMeta(token.tokenInfo.contract)"
                            @showNft="showNftTokens"
                        />
                        <table-address-tokens-row-loading v-else />
                    </v-card>
                </template>
            </table-txs>
            <v-layout
                v-if="showPagination && !loading"
                :justify-end="$vuetify.breakpoint.mdAndUp"
                :justify-center="$vuetify.breakpoint.smAndDown"
                row
                class="pb-1 pr-3 pl-2"
            >
                <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
            </v-layout>
        </div>
        <table-address-unique-nft
            v-else
            :contract-name="requestContractName"
            :contract="requestContract"
            :tokens="uniqueNFT"
            :loading="loadingUniqueNFT"
            @hideNFT="hideNFTTokens"
        />
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppNewUpdate from '@app/core/components/ui/AppNewUpdate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTokensRow from '@app/modules/address/components/TableAddressTokensRow.vue'
import TableAddressTokensRowLoading from '@app/modules/address/components/TableAddressTokensRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressUniqueNft from '@app/modules/address/components/TableAddressUniqueNft.vue'
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getOwnersERC20Tokens, getOwnersERC721Tokens, getOwnersERC721Balances, getNFTcontractsMeta } from './tokens.graphql'
import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokensType } from './apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721BalanceType } from './apolloTypes/getOwnersERC721Balances'
import {
    getOwnersERC721Tokens_getOwnersERC721Tokens as ERC721ContractTokensType,
    getOwnersERC721Tokens_getOwnersERC721Tokens_tokens as ERC721TokenType
} from './apolloTypes/getOwnersERC721Tokens'
import {
    getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts as NFTMetaType,
    getNFTcontractsMeta_getNFTcontractsMeta as getNFTcontractsMetaType
} from './apolloTypes/getNFTcontractsMeta'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { AddressEventType } from '@app/apollo/global/globalTypes'
import { ErrorMessage } from '../../models/ErrorMessagesForAddress'
/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/
interface NFTMap {
    [key: string]: ERC721TokenType[]
}
interface NFTMetaMap {
    [key: string]: NFTMetaType
}

@Component({
    components: {
        AppNewUpdate,
        AppTableTitle,
        AppPaginate,
        TableTxs,
        TableAddressTokensHeader,
        TableAddressTokensRow,
        TableAddressTokensRowLoading,
        TableAddressUniqueNft
    },
    apollo: {
        getTokens: {
            query() {
                return this.isERC20 ? getOwnersERC20Tokens : getOwnersERC721Balances
            },
            fetchPolicy: 'network-only',
            variables() {
                return {
                    hash: this.address
                }
            },
            deep: true,
            update(data) {
                if (this.isERC20) {
                    return data.getOwnersERC20Tokens ? data.getOwnersERC20Tokens.owners : null
                }
                return data.getOwnersERC721Balances
            },
            result({ data }) {
                if (this.hasTokens) {
                    this.emitErrorState(false)
                    if (this.isERC20) {
                        this.hasNext = data.getOwnersERC20Tokens.nextKey || null
                        if (this.hasNext != null) {
                            this.fetchMore(this.hasNext)
                        } else {
                            this.totalTokens = this.getTokens.length
                            this.$emit('totalERC20', this.totalTokens)
                            this.$emit('loadingERC20Tokens', false)
                            this.initialLoad = false
                            if (this.totalTokens > this.maxItems) {
                                this.totalPages = Math.ceil(new BN(this.totalTokens).div(this.maxItems).toNumber())
                                this.showPagination = true
                            }
                        }
                    } else {
                        this.initialLoad = false
                    }
                } else {
                    this.emitErrorState(true)
                    this.showPagination = false
                    this.initialLoad = true
                }
            },
            error(error) {
                this.emitErrorState(true)
            }
        },

        getOwnersERC721Tokens: {
            query: getOwnersERC721Tokens,
            variables() {
                return {
                    hash: this.address,
                    tokenContract: this.requestContract
                }
            },
            skip() {
                return this.skipGetUniqueTokens
            },
            update: data => data.getOwnersERC721Tokens,
            result({ data }) {
                if (this.getOwnersERC721Tokens.tokens) {
                    if (this.getOwnersERC721Tokens.nextKey) {
                        this.fetchMoreUniqueNFT()
                    } else {
                        this.uniqueNFTMap[this.requestContract] = this.getOwnersERC721Tokens.tokens
                        this.uniqueNFT = this.uniqueNFTMap[this.requestContract]
                        this.loadingUniqueNFT = false
                        this.emitErrorState(false)
                        this.skipGetUniqueTokens = true
                    }
                } else {
                    this.emitErrorState(true)
                    throw new Error('etOwnersERC721Tokens.tokens returns null')
                }
            },
            error(error) {
                this.emitErrorState(true)
            }
        },
        getNFTcontractsMeta: {
            query: getNFTcontractsMeta,
            variables() {
                return {
                    address: this.address
                }
            },
            client: 'OpenSeaClient',
            update: data => data.getNFTcontractsMeta,
            result({ data }) {
                this.createNFTMetaMap()
            }
        }
    }
})
export default class AddressTokens extends Mixins(CoinData) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(String) address!: string
    @Prop({ type: String, default: 'eth' }) tokenType!: string
    @Prop(Number) newTokens!: number
    @Prop(Boolean) refetchTokens!: boolean

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    syncing?: boolean = false
    initialLoad = true
    showPagination = false
    index = 0
    totalPages = 0
    /*isEnd -  Last Index loaded */
    isEnd = false
    pageType = 'address'
    getTokens!: ERC20TokensType[] | ERC721BalanceType[]
    hasNext!: string | null
    totalERC20 = 0
    totalERC721 = 0

    /* NFT Meta Info */
    getNFTcontractsMeta!: getNFTcontractsMetaType
    loadingMeta = true
    nftMeta: NFTMetaMap = {}

    /* Unique NFT List for contract */
    getOwnersERC721Tokens!: ERC721ContractTokensType
    uniqueNFTMap: NFTMap = {}
    loadingUniqueNFT = true
    showUniqueNFT = false
    uniqueNFT: ERC721TokenType[] = []
    requestContract = ''
    requestContractName = ''
    skipGetUniqueTokens = true
    hasError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get loading(): boolean {
        if (this.isNFT) {
            return this.initialLoad || this.loadingMeta
        }
        return this.initialLoad
    }

    get tokens(): ERC20TokensType[] | ERC721BalanceType[] {
        const start = this.index * this.maxItems
        if (!this.loading && this.hasTokens) {
            const end = start + this.maxItems > this.getTokens.length ? this.getTokens.length : start + this.maxItems
            return this.getTokens.slice(start, end)
        }
        return []
    }
    get tokenPrices(): Map<string, TokenMarketData> | false {
        if (!this.loading && this.isERC20) {
            const contracts: string[] = []
            this.getTokens.forEach(token => {
                contracts.push(token.tokenInfo.contract)
            })
            if (contracts.length > 0) {
                return this.getEthereumTokensMap(contracts)
            }
        }
        return false
    }

    get message(): string {
        if (!this.loading && this.hasTokens && this.getTokens.length === 0) {
            if (this.isNFT) {
                return `${this.$t('message.transfer.no-nft')}`
            }
            return `${this.$t('message.transfer.no-all')}`
        }
        return ''
    }

    get getTitle(): string {
        return this.isERC20 ? `${this.$t('token.erc20')}` : `${this.$t('token.erc721')}`
    }

    get hasTokens(): boolean {
        return this.getTokens && this.getTokens != null
    }

    get isERC20(): boolean {
        return this.tokenType === 'ERC20'
    }

    get isNFT(): boolean {
        return this.tokenType === 'ERC721'
    }

    get eventType(): AddressEventType {
        return this.isERC20 ? AddressEventType.NEW_ERC20_TRANSFER : AddressEventType.NEW_ERC721_TRANSFER
    }
    get updateText(): string {
        return `${this.$t('message.update.tokens')}`
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.$emit('resetUpdateCount', this.eventType, true)
        } else {
            this.index = page
        }
    }

    fetchMore(nextKey: string): void {
        this.$apollo.queries.getTokens.fetchMore({
            variables: {
                hash: this.address,
                _nextKey: nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newT = fetchMoreResult.getOwnersERC20Tokens.owners
                const prevT = previousResult.getOwnersERC20Tokens.owners
                return {
                    getOwnersERC20Tokens: {
                        __typename: previousResult.getOwnersERC20Tokens.__typename,
                        owners: [...prevT, ...newT],
                        nextKey: fetchMoreResult.getOwnersERC20Tokens.nextKey
                    }
                }
            }
        })
    }

    getUSDInfo(contract: string): TokenMarketData | undefined {
        if (!this.loading && this.tokenPrices && this.tokenPrices.has(contract)) {
            return this.tokenPrices.get(contract)
        }
        return undefined
    }
    /* NFT TOKENS*/

    showNftTokens(contract: string, name: string | null) {
        this.requestContractName = name ? name : contract
        if (contract) {
            if (this.uniqueNFTMap && this.uniqueNFTMap[contract]) {
                this.requestContract = contract
                this.uniqueNFT = this.uniqueNFTMap[contract]
                this.loadingUniqueNFT = false
                this.showUniqueNFT = true
            } else {
                /* Load Tokens */
                this.requestContract = contract
                this.showUniqueNFT = true
                this.loadingUniqueNFT = true
                this.skipGetUniqueTokens = false
            }
        }
    }
    fetchMoreUniqueNFT(): void {
        this.$apollo.queries.getTokens.fetchMore({
            variables: {
                hash: this.address,
                _nextKey: this.getOwnersERC721Tokens.nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newT = fetchMoreResult.getOwnersERC721Tokens
                const prevT = previousResult.getOwnersERC721Tokens
                return {
                    getOwnersERC721Tokens: {
                        __typename: previousResult.getOwnersERC721Tokens.__typename,
                        tokens: [...prevT, ...newT],
                        nextKey: fetchMoreResult.getOwnersERC721Tokens.nextKey
                    }
                }
            }
        })
    }
    hideNFTTokens(): void {
        this.showUniqueNFT = false
        this.loadingUniqueNFT = true
    }

    emitErrorState(val: boolean): void {
        this.hasError = val
        const errorType = this.isERC20 ? ErrorMessage.tokensERC20 : ErrorMessage.tokens721
        this.$emit('errorTokenBalance', this.hasError, errorType)
    }

    createNFTMetaMap(): void {
        const contracts = this.getNFTcontractsMeta ? this.getNFTcontractsMeta.tokenContracts : null
        if (contracts && contracts.length > 0) {
            contracts.forEach(contract => {
                if (contract && contract.primary_asset_contracts) {
                    contract.primary_asset_contracts.forEach(asset => {
                        this.nftMeta[asset.address] = asset
                    })
                }
            })
        }
        this.loadingMeta = false
    }

    getContractMeta(contract): NFTMetaType | undefined {
        if (this.isNFT) {
            return this.nftMeta[contract]
        }
        return undefined
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */

    @Watch('refetchTokens')
    onRefetchTokensChanged(newVal: boolean, oldVal: boolean): void {
        if (newVal && newVal !== oldVal) {
            if (this.isERC20) {
                this.$emit('loadingERC20Tokens', true)
            }
            if (this.isNFT) {
                this.loadingMeta = true
                this.$apollo.queries.getNFTcontractsMeta.refetch()
            }
            this.index = 0
            this.initialLoad = true
            this.totalPages = 0
            this.showPagination = false
            this.$apollo.queries.getTokens
                .refetch()
                .then(data => {
                    if (data) {
                        this.$emit('resetBalanceRefetch')
                    }
                })
                .catch(error => {
                    this.emitErrorState(true)
                    throw error
                })
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
