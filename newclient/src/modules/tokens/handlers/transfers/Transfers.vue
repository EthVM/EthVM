<template>
    <transfers-table
        :transfers="transferData"
        :loading="loading || hasError"
        :show-pagination="showPagination"
        :decimals="decimals"
        :symbol="symbol"
        :max-items="maxItems"
        :has-more="hasMore"
        :has-items="hasItems"
        :index="index"
        :has-error="hasError"
        @setPage="setPage"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import TransfersTable from '@app/modules/tokens/components/Transfers/TransfersTable.vue'
import { getERC20TokenTransfers, getERC721TokenTransfers } from '@app/modules/tokens/handlers/transfers/transfers.graphql'
import { getERC20Transfers_getERC20Transfers as ERC20TransfersType } from '@app/modules/tokens/handlers/transfers/apolloTypes/getERC20Transfers'
import { getERC721TokenTransfers_getERC721TokenTransfers as ERC721TransfersType } from '@app/modules/tokens/handlers/transfers/apolloTypes/getERC721TokenTransfers'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'

const MAX_ITEMS = 10

interface Transfer {
    transfer: object
    value?: string
}

@Component({
    components: {
        TransfersTable
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
                        this.showPagination = this.hasMoreERC20Transfers
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
                        this.showPagination = this.hasMoreERC721Transfers
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
export default class Transfers extends Vue {
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
    showPagination = false
    /*isEnd -  Last Index loaded */
    isEnd = 0
    initialLoad = true
    hasError = false
    /*
        ===================================================================================
          Methods
        ===================================================================================
        */
    emitErrorState(val: boolean, isErc20 = false): void {
        this.hasError = val
        const message = isErc20 ? ErrorMessageToken.erc20Transfers : ErrorMessageToken.erc721Transfers
        this.$emit('errorDetails', val, message)
    }

    getERC20Transfer(page: number) {
        const queryName = 'getERC20TokenTransfers'

        this.$apollo.queries.getERC20Transfers.fetchMore({
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
    }

    getERC721Transfer(page: number) {
        const queryName = 'getERC721TokenTransfers'

        this.$apollo.queries.getERC721Transfers.fetchMore({
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
    }

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
    get hasERC721Transfers() {
        return this.getERC721Transfers && this.getERC721Transfers.transfers
    }

    get transferData(): any[] {
        if (this.getERC20Transfers && this.getERC20Transfers.transfers) {
            const data: Array<Transfer> = []
            this.getERC20Transfers.transfers.forEach(transfer => {
                transfer ? data.push(transfer) : null
            })
            if (this.hasERC721Transfers) {
                this.getERC721Transfers.transfers.forEach(transfer => {
                    transfer ? data.push(transfer) : null
                })
            }
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
