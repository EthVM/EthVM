<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
<<<<<<< Updated upstream
        <!-- LOADING / ERROR -->
        <v-flex v-if="loading || hasError" xs12>
            <v-progress-linear color="blue" indeterminate />
        </v-flex>
=======
        <app-error :has-error="hasError" :message="error" class="mb-4" />
>>>>>>> Stashed changes
        <!-- Pagination -->
        <v-layout v-if="showPagination" row fill-height justify-end class="pb-1 pr-2 pl-2">
            <app-paginate-has-more :has-more="hasMore" :current-page="index" @newPage="setPage" />
        </v-layout>
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!hasError">
            <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2 hidden-sm-and-down" height="40px">
                <v-layout align-center justify-start row fill-height pr-3>
                    <v-flex sm6>
                        <h5>{{ $tc('address.name', 1) }}</h5>
                    </v-flex>
                    <v-flex sm3 md4>
                        <h5>{{ $t('common.quantity') }}</h5>
                    </v-flex>
                    <v-flex sm3 md2>
                        <h5>{{ $t('common.percentage') }}</h5>
                    </v-flex>
                </v-layout>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <v-card v-if="loading || hasError" flat>
                <v-flex xs12>
                    <div v-for="i in maxItems" :key="i">
                        <app-table-row-loading />
                    </div>
                </v-flex>
            </v-card>
            <div v-else>
                <v-card v-if="!hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">{{ $t('message.token.no-holders') }}</v-card-text>
                </v-card>
                <div v-for="(holder, i) in holders" v-else :key="i">
                    <token-table-holders-row :holder="holder" :token-address="addressRef" :decimals="decimals" />
                </div>
            </div>
        </div>
        <!-- End Rows -->
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TokenTableHoldersRow from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHoldersRow.vue'
import { getERC20TokenOwners } from '@app/modules/tokens/handlers/tokenDetails/tokenDetails.graphql'
import { ERC20TokenOwners as TokenOwners } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/ERC20TokenOwners'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import AppTableRowLoading from '@app/core/components/ui/AppTableRowLoading.vue'

const MAX_ITEMS = 10
@Component({
    components: {
        AppPaginateHasMore,
        AppPaginate,
        TokenTableHoldersRow,
        AppTableRowLoading
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
export default class TokenTableHolders extends Vue {
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
        if (this.holdersPage.owners) {
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
        return this.holdersPage.nextKey !== null
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
