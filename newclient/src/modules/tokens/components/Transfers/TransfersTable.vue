<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
        <!-- LOADING / ERROR -->
        <v-flex v-if="loading" xs12>
            <v-progress-linear color="blue" indeterminate />
        </v-flex>
        <!-- Pagination -->
        <v-layout v-if="showPagination" row fill-height justify-end class="pb-1 pr-2 pl-2">
            <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading" @newPage="setPage" />
        </v-layout>
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!hasError">
            <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2 hidden-xs-only" height="40px">
                <v-layout align-center justify-start row fill-height pr-2>
                    <v-flex :class="[$vuetify.breakpoint.name === 'sm' ? 'pr-3' : 'pr-5']" sm6 md7>
                        <h5>{{ $tc('tx.hash', 1) }}</h5>
                    </v-flex>
                    <v-flex sm2>
                        <h5>{{ $t('common.age') }}</h5>
                    </v-flex>
                    <v-flex sm2>
                        <h5>{{ $t('common.quantity') }}</h5>
                    </v-flex>
                </v-layout>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <div v-if="loading">
                <v-flex sm12>
                    <div v-for="i in maxItems" :key="i" :class="[$vuetify.breakpoint.name === 'xs' ? 'table-row-mobile mb-2' : '']">
                        <transfers-table-row-loading />
                    </div>
                </v-flex>
            </div>
            <div v-else>
                <v-card v-if="!hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
                </v-card>
                <v-card v-for="(transfer, index) in transferData" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row :transfer="transfer" :decimals="decimals" :symbol="symbol" />
                </v-card>
                <!-- End Rows -->
                <v-layout v-if="showPagination" justify-end row class="pb-1 pr-2 pl-2">
                    <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading" @newPage="setPage" />
                </v-layout>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import TransfersTableRow from './TransfersTableRow.vue'
import TransfersTableRowLoading from './TransfersTableRowLoading.vue'
import BigNumber from 'bignumber.js'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import { getERC20Transfers } from '@app/modules/tokens/handlers/transfers/transfers.graphql'
import { getERC20Transfers_getERC20Transfers as ERC20TransfersType } from '@app/modules/tokens/handlers/transfers/apolloTypes/getERC20Transfers'

const MAX_ITEMS = 10

@Component({
    components: {
        AppTimeAgo,
        AppError,
        TransfersTableRow,
        TransfersTableRowLoading,
        AppPaginateHasMore,
        AppPaginate
    },
    apollo: {
        getTransfers: {
            query: getERC20Transfers,
            fetchPolicy: 'network-only',
            variables() {
                return { hash: this.address, _limit: this.maxItems }
            },
            deep: true,
            update: data => data.getERC20Transfers,
            result({ data }) {
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
export default class TransfersTable extends Vue {
    /*
        ===================================================================================
          Props
        ===================================================================================
        */

    @Prop(String) address!: string
    @Prop(String) pageType!: string
    @Prop(Number) decimals?: number
    // @Prop(String) holder?: string
    @Prop(String) symbol?: string

    getTransfers!: ERC20TransfersType
    error?: string
    page?: number
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
                const queryName = 'getERC20Transfers'

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
        if (this.getTransfers.transfers) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getTransfers.transfers.length ? this.getTransfers.transfers.length : start + this.maxItems
            return this.getTransfers.transfers.slice(start, end)
        }
        return []
    }

    get hasMore(): boolean {
        return this.getTransfers.nextKey !== null
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

    get hasError(): boolean {
        return !!this.error && this.error !== ''
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

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
