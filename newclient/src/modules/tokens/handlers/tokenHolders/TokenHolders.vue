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
        @setPage="setPage"
    />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getERC20TokenOwners } from '@app/modules/tokens/handlers/tokenHolders/tokenHolders.graphql'
import { ERC20TokenOwners as TokenOwners } from '@app/modules/tokens/handlers/tokenHolders/apolloTypes/ERC20TokenOwners'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import TokenTableHolders from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHolders.vue'

const MAX_ITEMS = 10
@Component({
    components: {
        TokenTableHolders
    },
    apollo: {
        holdersPage: {
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
                        this.showPagination = this.hasMore
                        this.initialLoad = false
                    }
                } else {
                    this.showPagination = false
                    this.initialLoad = true
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

    holdersPage!: TokenOwners
    hasError = false
    page?: number
    showPagination = false
    index = 0
    isEnd = 0
    initialLoad = true

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorDetails', this.hasError, ErrorMessageToken.tokenOwner)
    }

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.holdersPage.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                const queryName = 'getERC20TokenOwners'

                this.$apollo.queries.holdersPage.fetchMore({
                    variables: {
                        contract: this.addressRef,
                        _limit: this.maxItems,
                        _nextKey: this.holdersPage.nextKey
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
            }
        }
        this.index = page
    }

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get holders(): any[] {
        if (this.holdersPage && this.holdersPage) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.holdersPage.owners.length ? this.holdersPage.owners.length : start + this.maxItems
            return this.holdersPage.owners.slice(start, end)
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
        return !!(this.holdersPage && this.holdersPage.owners.length)
    }

    get hasMore(): boolean {
        return this.holdersPage && this.holdersPage.nextKey !== null
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
