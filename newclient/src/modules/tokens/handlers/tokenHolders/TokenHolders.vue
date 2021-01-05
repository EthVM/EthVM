<template>
    <token-table-holders
        :holders="holders"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="decimals"
        :max-items="maxItems"
        :has-more="hasMore"
        :has-items="hasItems"
        :index="index"
        :has-error="hasError"
        :address-ref="addressRef"
        :holder-type="holderType"
        @setPage="setPage"
    />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getERC20TokenOwners, getERC721TokenOwners } from '@app/modules/tokens/handlers/tokenHolders/tokenHolders.graphql'
import { ERC20TokenOwners } from '@app/modules/tokens/handlers/tokenHolders/apolloTypes/ERC20TokenOwners'
import { ERC721TokenOwners } from '@app/modules/tokens/handlers/tokenHolders/apolloTypes/ERC721TokenOwners'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import TokenTableHolders from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHolders.vue'
import { excpInvariantViolation } from '@app/apollo/exceptions/errorExceptions'

const TYPES = ['ERC20', 'ERC721']

const MAX_ITEMS = 10
@Component({
    components: {
        TokenTableHolders
    },
    apollo: {
        erc20TokenHolders: {
            query: getERC20TokenOwners,
            fetchPolicy: 'network-only',
            variables() {
                return {
                    contract: this.addressRef,
                    _limit: this.maxItems
                }
            },
            deep: true,
            update: data => data.getERC20TokenOwners,
            result({ data }) {
                if (this.hasItems) {
                    if (data.getERC20TokenOwners) {
                        this.emitErrorState(false)
                    }
                    if (this.initialLoad) {
                        this.initialLoad = false
                    }
                } else {
                    this.initialLoad = true
                }
            },
            error(error) {
                this.emitErrorState(true)
            }
        },
        erc721TokenHolders: {
            query: getERC721TokenOwners,
            fetchPolicy: 'network-only',
            variables() {
                return {
                    contract: this.addressRef,
                    _limit: this.maxItems
                }
            },
            deep: true,
            update: data => data.getERC721TokenOwners,
            result({ data }) {
                if (this.hasItems) {
                    if (data.getERC721TokenOwners) {
                        if (!data.getERC721TokenOwners.owners || data.getERC721TokenOwners.owners.length < 1) {
                            this.$emit('isNft', false)
                        }
                        this.emitErrorState(false)
                    }
                    if (this.initialLoad) {
                        this.initialLoad = false
                    }
                } else {
                    this.initialLoad = true
                    this.$emit('isNft', false)
                }
            },
            error(error) {
                this.emitErrorState(true)
            }
        }
    }
})
export default class TokenHolders extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) addressRef!: string
    @Prop(Number) decimals?: number

    erc20TokenHolders!: ERC20TokenOwners
    erc721TokenHolders!: ERC721TokenOwners
    hasError = false
    page?: number
    index = 0
    isEnd = 0
    initialLoad = true
    holderType = TYPES[0]

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Emit error to Sentry
     * @param val {Boolean}
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorDetails', this.hasError, ErrorMessageToken.tokenOwner)
    }
    /**
     * Gets ERC20 holders via apollo
     * @param page {Number}
     * @returns {Any}
     */
    async getERC20Holders(page: number): Promise<boolean> {
        try {
            const queryName = 'getERC20TokenOwners'
            await this.$apollo.queries.erc20TokenHolders.fetchMore({
                variables: {
                    contract: this.addressRef,
                    _limit: this.maxItems,
                    _nextKey: this.erc20TokenHolders.nextKey
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    this.isEnd = page
                    const newT = fetchMoreResult[queryName].owners
                    const prevT = previousResult[queryName].owners
                    return {
                        [queryName]: {
                            nextKey: fetchMoreResult[queryName].nextKey,
                            owners: [...prevT, ...newT],
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
     * Gets ERC721 holders via apollo
     * @param page {Number}
     * @returns {Any}
     */
    async getERC721Holders(page: number): Promise<boolean> {
        try {
            const queryName = 'getERC721TokenOwners'
            await this.$apollo.queries.erc721TokenHolders.fetchMore({
                variables: {
                    contract: this.addressRef,
                    _limit: this.maxItems,
                    _nextKey: this.erc721TokenHolders.nextKey
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    this.isEnd = page
                    const newT = fetchMoreResult[queryName].owners
                    const prevT = previousResult[queryName].owners
                    return {
                        [queryName]: {
                            nextKey: fetchMoreResult[queryName].nextKey,
                            owners: [...prevT, ...newT],
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
            this.$apollo.queries.erc20TokenHolders.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                this.hasMoreERC20Holders ? this.getERC20Holders(page) : null
                this.hasMoreERC721Holders ? this.getERC721Holders(page) : null
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
        return this.hasMoreERC20Holders || this.hasMoreERC721Holders
    }

    get hasERC721Owners() {
        return this.erc721TokenHolders && this.erc721TokenHolders.owners && this.erc721TokenHolders.owners.length > 0
    }

    get hasERC20Owners() {
        return this.erc20TokenHolders && this.erc20TokenHolders.owners
    }

    get holders(): any[] {
        if (this.hasERC20Owners && this.erc721TokenHolders) {
            const data = this.hasERC721Owners ? this.erc721TokenHolders.owners : this.erc20TokenHolders.owners
            this.holderType = this.hasERC721Owners ? TYPES[1] : TYPES[0]
            const start = this.index * this.maxItems
            const end = start + this.maxItems > data.length ? data.length : start + this.maxItems
            return data.slice(start, end)
        }
        return []
    }

    get maxItems() {
        return MAX_ITEMS
    }

    get loading(): boolean {
        return this.$apollo.loading
    }

    get hasItems(): boolean {
        return !!(this.holders && this.holders.length)
    }

    get hasMoreERC20Holders(): boolean {
        return this.erc20TokenHolders && this.erc20TokenHolders.nextKey !== null
    }

    get hasMoreERC721Holders(): boolean {
        return this.erc721TokenHolders && this.erc721TokenHolders.nextKey !== null
    }

    get hasMore(): boolean {
        return this.hasMoreERC20Holders || this.hasMoreERC721Holders
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
