<template>
    <token-table-transfers
        :transfers="transferData"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="decimals"
        :symbol="symbol"
        :max-items="maxItems"
        :has-more="hasMore"
        :has-items="hasItems"
        :index="index"
        :has-error="hasError"
        :transfer-type="transferType"
        @setPage="setPage"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import TokenTableTransfers from '@app/modules/tokens/components/TokenDetailsTransfer/TokenTableTransfers.vue'
import { getERC20TokenTransfers, getERC721TokenTransfers } from '@app/modules/tokens/handlers/tokenTransfers/tokenTransfers.graphql'
import { getERC20Transfers_getERC20Transfers as ERC20TransfersType } from '@app/modules/tokens/handlers/tokenTransfers/apolloTypes/getERC20Transfers'
import { getERC721TokenTransfers_getERC721TokenTransfers as ERC721TransfersType } from '@app/modules/tokens/handlers/tokenTransfers/apolloTypes/getERC721TokenTransfers'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import { excpInvariantViolation } from '@app/apollo/exceptions/errorExceptions'

const TYPES = ['ERC20', 'ERC721']

const MAX_ITEMS = 10

@Component({
    components: {
        TokenTableTransfers
    },
    apollo: {
        getERC20Transfers: {
            query: getERC20TokenTransfers,
            fetchPolicy: 'network-only',
            variables() {
                return { hash: this.address, _limit: this.maxItems }
            },
            deep: true,
            update: data => data.getERC20TokenTransfers,
            result({ data }) {
                if (data && data.getERC20TokenTransfers) {
                    this.emitErrorState(false)
                    if (this.initialLoad) {
                        this.initialLoad = false
                    }
                }
            },
            error(error) {
                this.emitErrorState(true, true)
            }
        },
        getERC721Transfers: {
            query: getERC721TokenTransfers,
            fetchPolicy: 'network-only',
            variables() {
                return { hash: this.address, _limit: this.maxItems }
            },
            deep: true,
            update: data => data.getERC721TokenTransfers,
            result({ data }) {
                if (data && data.getERC721TokenTransfer) {
                    this.emitErrorState(false)
                    if (this.initialLoad) {
                        this.initialLoad = false
                    }
                }
            },
            error(error) {
                this.emitErrorState(true, false)
            }
        }
    }
})
export default class TokenTransfers extends Vue {
    /*
        ===================================================================================
          Props
        ===================================================================================
        */

    @Prop(String) address!: string
    @Prop(String) pageType!: string
    @Prop(Number) decimals?: number
    @Prop(String) symbol?: string

    /*
        ===================================================================================
          Initial Data
        ===================================================================================
        */
    getERC721Transfers!: ERC721TransfersType
    getERC20Transfers!: ERC20TransfersType
    page?: number
    index = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    initialLoad = true
    hasError = false
    transferType = TYPES[0]
    /*
        ===================================================================================
          Methods
        ===================================================================================
        */
    /**
     * Emit error to Sentry
     * @param val {Boolean}
     * @param isErc20 {Boolean}
     */
    emitErrorState(val: boolean, isErc20 = false): void {
        this.hasError = val
        const message = isErc20 ? ErrorMessageToken.erc20Transfers : ErrorMessageToken.erc721Transfers
        this.$emit('errorDetails', val, message)
    }
    /**
     * Gets ERC20 through apollo
     * @param page {Number}
     */
    async getERC20Transfer(page: number): Promise<boolean> {
        try {
            const queryName = 'getERC20TokenTransfers'

            await this.$apollo.queries.getERC20Transfers.fetchMore({
                variables: {
                    hash: this.address,
                    _limit: 10,
                    _nextKey: this.getERC20Transfers.nextKey
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
     * Gets ERC721 through apollo
     * @param page {Number}
     */
    async getERC721Transfer(page: number): Promise<boolean> {
        try {
            const queryName = 'getERC721TokenTransfers'

            await this.$apollo.queries.getERC721Transfers.fetchMore({
                variables: {
                    hash: this.address,
                    _limit: 10,
                    _nextKey: this.getERC721Transfers.nextKey
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
     * Sets page number and reset value and emit
     * @param page {Number}
     * @param reset {Boolean}
     */
    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getERC20Transfers.refetch()
            this.$apollo.queries.getERC721Transfers.refetch()
        } else {
            if (page > this.isEnd) {
                this.hasMoreERC20Transfers ? this.getERC20Transfer(page) : null
                this.hasMoreERC721Transfers ? this.getERC721Transfer(page) : null
            }
        }
        this.index = page
    }
    /*
        ===================================================================================
          Computed Values
        ===================================================================================
        */
    get showPagination(): boolean {
        return this.hasMoreERC721Transfers || this.hasMoreERC20Transfers
    }

    get hasERC721Transfers() {
        return this.getERC721Transfers && this.getERC721Transfers.transfers && this.getERC721Transfers.transfers.length > 0
    }

    get hasERC20Transfers() {
        return this.getERC20Transfers && this.getERC20Transfers.transfers
    }

    get transferData(): any[] {
        if (this.hasERC20Transfers && this.getERC721Transfers) {
            const data = this.hasERC721Transfers ? this.getERC721Transfers.transfers : this.getERC20Transfers.transfers
            this.transferType = this.hasERC721Transfers ? TYPES[1] : TYPES[0]
            const start = this.index * this.maxItems
            const end = start + this.maxItems > data.length ? data.length : start + this.maxItems
            return data.slice(start, end)
        }
        return []
    }

    get hasMoreERC20Transfers(): boolean {
        return this.getERC20Transfers ? this.getERC20Transfers.nextKey !== null : false
    }

    get hasMoreERC721Transfers(): boolean {
        return this.getERC721Transfers ? this.getERC721Transfers.nextKey !== null : false
    }

    get hasMore(): boolean {
        return this.hasMoreERC20Transfers || this.hasMoreERC721Transfers
    }

    get isToken(): boolean {
        return this.pageType === 'token'
    }

    // get isTokenHolder(): boolean {
    //     return this.pageType === 'tokenHolder'
    // }

    get loading() {
        return this.$apollo.loading
    }

    get hasItems(): boolean {
        return !!(this.transferData && this.transferData.length)
    }

    /**
     * @return {Number} - MAX_ITEMS per pagination page
     */
    get maxItems(): number {
        return MAX_ITEMS
    }
}
</script>
