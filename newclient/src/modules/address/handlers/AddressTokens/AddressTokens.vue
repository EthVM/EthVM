<template>
    <v-card color="white" flat class="pb-2">
        <div v-if="!showUniqueNFT">
            <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
                <!-- Notice new update-->
                <!-- <template v-slot:update >
                <notice-new-block @reload="setPage(0, true)" />
            </template> -->
                <template v-slot:pagination v-if="showPagination && !initialLoad">
                    <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
                </template>
            </app-table-title>
            <table-txs :max-items="maxItems" :index="index" :is-loading="initialLoad" :table-message="message" :txs-data="tokens" :is-scroll-view="false">
                <template #header>
                    <table-address-tokens-header :is-erc20="isERC20" :is-transfers="false" />
                </template>
                <template #rows>
                    <v-card v-for="(token, index) in tokens" :key="index" class="transparent" flat>
                        <table-address-tokens-row
                            v-if="!initialLoad"
                            :token="token"
                            :is-erc20="isERC20"
                            :holder="address"
                            :token-price-info="getUSDInfo(token.tokenInfo.contract)"
                            @showNft="showNftTokens"
                        />
                        <table-address-tokens-row-loading v-else />
                    </v-card>
                </template>
            </table-txs>
            <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
                <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
            </v-layout>
        </div>
        <table-address-unique-nft v-else :contract-name="'hello'" :tokens="uniqueNFT" :loading="loadingUniqueNFT" @hideNFT="hideNFTTokens" />
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
// import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTokensRow from '@app/modules/address/components/TableAddressTokensRow.vue'
import TableAddressTokensRowLoading from '@app/modules/address/components/TableAddressTokensRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressUniqueNft from '@app/modules/address/components/TableAddressUniqueNft.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getOwnersERC20Tokens, getOwnersERC721Tokens, getOwnersERC721Balances } from './tokens.graphql'
import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokensType } from './apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721BalanceType } from './apolloTypes/getOwnersERC721Balances'
import {
    getOwnersERC721Tokens_getOwnersERC721Tokens as ERC721ContractTokensType,
    getOwnersERC721Tokens_getOwnersERC721Tokens_tokens as ERC721TokenType
} from './apolloTypes/getOwnersERC721Tokens'

import { IEthereumToken } from '@app/plugins/CoinData/models'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/
interface NFTMap {
    [key: string]: ERC721TokenType[]
}

@Component({
    components: {
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
                return this.isERC20 ? data.getOwnersERC20Tokens.owners : data.getOwnersERC721Balances
            },
            result({ data }) {
                if (this.hasTokens) {
                    this.error = '' // clear the error
                    if (this.isERC20) {
                        this.hasNext = data.getOwnersERC20Tokens.nextKey || null
                        if (this.hasNext != null) {
                            this.fetchMore()
                        } else {
                            this.totalTokens = this.getTokens.length
                            this.$emit('totalERC20', this.totalTokens)
                            if (this.totalTokens > this.maxItems) {
                                this.totalPages = Math.ceil(new BN(this.totalTokens).div(this.maxItems).toNumber())
                                this.showPagination = true
                            }
                            const contracts = this.getTokens.map(token => token.tokenInfo.contract)
                            this.$CD
                                .getEthereumTokensMap(contracts)
                                .then(data => {
                                    this.tokenPrices = data
                                    this.initialLoad = false
                                })
                                .catch(error => {
                                    console.log(error)
                                    this.initialLoad = false
                                })
                        }
                    }
                    this.initialLoad = false
                } else {
                    console.log('error failed no data: ', data)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                    this.$apollo.queries.getTokens.refetch()
                }
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
                        this.skipGetUniqueTokens = true
                    }
                }
            }
        }
    }
})
export default class AddressTokens extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(String) address!: string
    @Prop({ type: String, default: 'eth' }) tokenType!: string

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
    isEnd = false
    pageType = 'address'
    getTokens!: ERC20TokensType[] | ERC721BalanceType[]
    hasNext!: string | null
    totalERC20 = 0
    totalERC721 = 0
    tokenPrices: Map<string, IEthereumToken> | false = false

    /* Unique NFT List for contract */
    getOwnersERC721Tokens!: ERC721ContractTokensType
    uniqueNFTMap: NFTMap = {}
    loadingUniqueNFT = true
    showUniqueNFT = false
    uniqueNFT: ERC721TokenType[] = []
    requestContract = ''
    skipGetUniqueTokens = true

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get tokens(): ERC20TokensType[] | ERC721BalanceType[] {
        const start = this.index * this.maxItems
        if (!this.initialLoad && this.hasTokens) {
            const end = start + this.maxItems > this.getTokens.length ? this.getTokens.length : start + this.maxItems
            return this.getTokens.slice(start, end)
        }
        return []
    }

    get message(): string {
        if (!this.initialLoad && this.hasTokens && this.getTokens.length === 0) {
            return `${this.$t('message.transfer.no-all')}`
        }
        if (this.error != '') {
            return this.error
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

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.index = 0
            this.initialLoad = true
            this.totalPages = 0
            this.$apollo.queries.getTokens.refetch()
        } else {
            this.index = page
        }
    }

    fetchMore(): void {
        this.$apollo.queries.getTokens.fetchMore({
            variables: {
                hash: this.address,
                _nextKey: this.getTokens.nextKey
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

    getUSDInfo(contract: string): IEthereumToken | undefined {
        if (!this.initialLoad && this.tokenPrices && this.tokenPrices.has(contract)) {
            return this.tokenPrices.get(contract)
        }
        return undefined
    }
    /* NFT TOKENS*/

    showNftTokens(contract: string) {
        if (contract) {
            if (this.uniqueNFTMap && this.uniqueNFTMap[contract]) {
                this.uniqueNFT = this.uniqueNFTMap[contract]
                this.loadingUniqueNFT = false
                this.showUniqueNFT = true
            } else {
                /* Load Tokens */
                this.showUniqueNFT = true
                this.requestContract = contract
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
