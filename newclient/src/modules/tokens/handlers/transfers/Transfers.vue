<template>
    <transfers-table
        :transfers="transferData"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="decimals"
        :symbol="symbol"
        :error="error"
        :max-items="maxItems"
        :has-more="hasMore"
        :has-items="hasItems"
        :index="index"
        @setPage="setPage"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import TransfersTable from '@app/modules/tokens/components/Transfers/TransfersTable.vue'
import { getERC20TokenTransfers } from '@app/modules/tokens/handlers/transfers/transfers.graphql'
import { getERC20Transfers_getERC20Transfers as ERC20TransfersType } from '@app/modules/tokens/handlers/transfers/apolloTypes/getERC20Transfers'

const MAX_ITEMS = 10

@Component({
    components: {
        TransfersTable
    },
    apollo: {
        getTransfers: {
            query: getERC20TokenTransfers,
            fetchPolicy: 'network-only',
            variables() {
                return { hash: this.address, _limit: this.maxItems }
            },
            deep: true,
            update: data => data.getERC20TokenTransfers,
            result({ data }) {
                // console.error('data', data)
                if (this.hasItems) {
                    this.error = ''
                    if (this.initialLoad) {
                        this.showPagination = this.hasMore
                        this.initialLoad = false
                    }
                } else {
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                    this.$apollo.queries.getTransfers.refetch()
                }
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
    getTransfers!: ERC20TransfersType
    page?: number
    error = ''
    index = 0
    showPagination = false
    /*isEnd -  Last Index loaded */
    isEnd = 0
    initialLoad = true

    /*
        ===================================================================================
          Methods
        ===================================================================================
        */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getTransfers.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                const queryName = 'getERC20TokenTransfers'

                this.$apollo.queries.getTransfers.fetchMore({
                    variables: {
                        hash: this.address,
                        _limit: 10,
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
          Computed Values
        ===================================================================================
        */
    get transferData(): any[] {
        if (this.getTransfers && this.getTransfers.transfers) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getTransfers.transfers.length ? this.getTransfers.transfers.length : start + this.maxItems
            return this.getTransfers.transfers.slice(start, end)
        }
        return []
    }

    get hasMore(): boolean {
        return this.getTransfers ? this.getTransfers.nextKey !== null : false
    }

    get isToken(): boolean {
        return this.pageType === 'token'
    }

    // get isTokenHolder(): boolean {
    //     return this.pageType === 'tokenHolder'
    // }

    get transfers() {
        return this.getTransfers ? this.getTransfers.transfers || [] : []
    }

    get loading() {
        return this.$apollo.loading
    }

    get hasItems(): boolean {
        return !!(this.getTransfers && this.getTransfers.transfers.length)
    }

    /**
     * @return {Number} - MAX_ITEMS per pagination page
     */
    get maxItems(): number {
        return MAX_ITEMS
    }
}
</script>
