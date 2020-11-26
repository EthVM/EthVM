<template>
    <v-card color="white" flat class="pb-2">
        <!--
        =====================================================================================
          Desktop (md-and-up): TITLE / ADD button / CANCEL button / REMOVE button
          Mobile (SM): TITLE / ADD button / CHECK ALL button / CANCEL button/ REMOVE button
          Mobile (xs-only): TITLE
        =====================================================================================
        -->
        <v-layout align-center justify-start row wrap pl-3 pr-3 mt-1>
            <app-table-title :title="title" :has-pagination="false" :page-type="pageType" page-link="" class="pl-2" />
            <v-spacer hidden-xs-only />
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
        <!--
        =====================================================================================
        SM AND UP: Search / Pagination
        =====================================================================================
        -->
        <v-layout align-center justify-space-between row hidden-xs-only px-2 my-2>
            <v-flex shrink py-0 pl-4>
                {{ totalText }}
            </v-flex>
            <v-spacer hidden-sm-and-down />
            <v-flex xs12 sm6 md7 align-self-end text-xs-right pr-2>
                <fav-search :items="favTokens" :loading="isLoading" @search="onSearch" />
            </v-flex>
        </v-layout>

        <!--
        =====================================================================================
          Mobile (xs-only): Search / Pagination
        =====================================================================================
        -->
        <v-layout grid-list-xs align-center justify-center hidden-sm-and-up row wrap pr-2 pl-2 mb-3>
            <v-flex xs12 pb-0 pt-0>
                <app-filter :options="options" :show-desktop="false" :is-sort="true" @onSelectChange="sortTokens" />
            </v-flex>
            <v-flex xs12 pb-0 pt-0>
                <fav-search :items="favTokens" :loading="isLoading" @search="onSearch" />
            </v-flex>
            <v-flex shrink pt-0 pb-0>
                <app-paginate
                    v-if="totalPages > 1"
                    :total="totalPages"
                    :current-page="index"
                    :has-input="true"
                    :has-first="true"
                    :has-last="true"
                    @newPage="setPage"
                />
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          Fav Address Table
        =====================================================================================
        -->
        <table-txs
            :max-items="maxItems"
            :index="index"
            :is-loading="isLoading || hasError"
            :txs-data="tokenList"
            :is-scroll-view="false"
            :table-message="message"
        >
            <template #header>
                <fav-tokens-table-header :loading="isLoading" :sort="sort" @sortBy="sortTokens" />
            </template>
            <template #rows>
                <v-card v-for="(token, index) in tokenList" :key="index" class="transparent" flat>
                    <fav-tokens-table-row :token="token" />
                </v-card>
            </template>
        </table-txs>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorite-tokens/models/ErrorMessagesFav'
import { Crumb } from '@app/core/components/props'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import FavTokensTableHeader from '@app/modules/favorite-tokens/components/FavTokensTableHeader.vue'
import FavTokensTableRow from '@app/modules/favorite-tokens/components/FavTokensTableRow.vue'
import FavSearch from '@app/modules/favorite-tokens/components/FavSearch.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { FavActions as FavActionsMixin } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { favTokenCache } from '@app/apollo/favorite-tokens/rootQuery.graphql'
import { favTokenCache_favTokens as favTokensType } from '@app/apollo/favorite-tokens/apolloTypes/favTokenCache'
import { EnumAdrChips } from '@app/core/components/props'
import { FILTER_VALUES, FavSort } from '@app/modules/favorite-tokens/models/FavSort'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices.ts'
import AppFilter from '@app/core/components/ui/AppFilter.vue'

import BN from 'bignumber.js'

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        FavTokensTableHeader,
        FavTokensTableRow,
        FavSearch,
        TableTxs,
        AppFilter
    },
    apollo: {
        favTokens: {
            query: favTokenCache,
            client: 'FavTokClient',
            fetchPolicy: 'network-only',
            update: data => data.favTokens,
            result({ data }) {
                if (data && data.favTokens) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.addressCheck)
            }
        }
    }
})
export default class FavHandlerTokensListRow extends Mixins(CoinData, FavActionsMixin) {
    /*
    ===================================================================================
      Data:
    ===================================================================================
    */
    pageType = 'fav_tokens'
    index = 0
    favTokens!: favTokensType[]
    hasError = false
    maxItems = 10
    /* Search */
    searchVal = ''
    /* Delete Mode */
    deleteMode = false
    deleteArray: string[] = []
    isAllSelected = false
    addressChipsMap = new Map<string, EnumAdrChips[]>()
    sort = ''

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get options() {
        return [
            {
                value: FILTER_VALUES[0],
                text: this.$i18n.tc('token.name', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[1],
                text: this.$i18n.tc('token.name', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[2],
                text: this.$i18n.tc('price.name', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[3],
                text: this.$i18n.tc('price.name', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[4],
                text: this.$i18n.tc('token.volume', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[5],
                text: this.$i18n.tc('token.volume', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[6],
                text: this.$i18n.t('token.market'),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[7],
                text: this.$i18n.t('token.market'),
                filter: this.$i18n.t('filter.low')
            }
        ]
    }

    get title(): string {
        return `${this.$t('token.favorite-title')}`
    }
    get totalFavorites(): number | null {
        return this.favorites ? this.favorites.length : null
    }

    get totalText(): string {
        return `${this.$t('contract.total')}: ${this.totalFavorites}`
    }

    get isLoading(): boolean {
        return this.$apollo.queries.favTokens.loading
    }
    get hasFavAdr(): boolean {
        return this.totalPages > 0
    }
    get coinMarketFavorites(): Array<{}> {
        if (!this.isLoading || this.hasFavAdr) {
            const coinMarketParams = this.favorites.map(item => {
                return item.address
            })
            const coinMarketInfo = this.getEthereumTokensMap(coinMarketParams)
            const favorites: Array<{}> = []
            this.favorites.forEach(token => {
                const getTokenFromCoinMarketList = coinMarketInfo ? coinMarketInfo.get(token.address) : new Map<string, TokenMarketData>()
                if (getTokenFromCoinMarketList) {
                    favorites.push(Object.assign({}, getTokenFromCoinMarketList))
                } else {
                    favorites.push({
                        contract: token.address,
                        current_price: 0,
                        id: token.symbol,
                        image: '',
                        market_cap: 0,
                        name: token.symbol.charAt(0).toUpperCase() + token.symbol.slice(1),
                        price_change_percentage_24h: 0,
                        symbol: token.symbol,
                        total_supply: '0',
                        total_volume: 0,
                        __typename: 'TokenMarketInfo'
                    })
                }
            })

            return favorites
        }
        return []
    }

    get tokenList(): Array<{}> {
        if (!this.isLoading || this.hasFavAdr) {
            this.sort !== '' ? this.favSort.sortFavorites(this.coinMarketFavorites, this.sort) : ''
            const start = this.searchVal ? 0 : this.index * this.maxItems
            const end = start + this.maxItems > this.coinMarketFavorites.length ? this.coinMarketFavorites.length : start + this.maxItems
            return this.coinMarketFavorites
        }
        return []
    }
    get totalPages(): number {
        if (this.favorites && this.favorites.length) {
            return Math.ceil(new BN(this.favorites.length).div(this.maxItems).toNumber())
        }
        return 0
    }
    get favorites(): favTokensType[] {
        const searchResults = this.searchVal
            ? this.favTokens.filter(item => item.symbol.toLowerCase().includes(this.searchVal) || item.address.toLowerCase().includes(this.searchVal))
            : []
        return searchResults && this.searchVal ? searchResults : this.favTokens
    }
    get message(): string {
        if (!this.isLoading) {
            if (this.searchVal && (!this.totalFavorites || this.totalFavorites < 1)) {
                return this.$t('fav.message.no-search-results').toString()
            }
            if (!this.totalFavorites || this.totalFavorites < 1) {
                return this.$t('fav.message.no-addr').toString()
            }
        }
        return ''
    }

    get favSort(): FavSort {
        return new FavSort(this.favorites)
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    sortTokens(sort: string): void {
        this.sort = sort
    }
    emitErrorState(val: boolean, message: string): void {
        this.hasError = val
        this.$emit('errorFavorites', this.hasError, message)
    }

    onSearch(val): void {
        this.searchVal = val ? val.toLowerCase() : null
    }
    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.index = 0
        } else {
            this.index = page
        }
    }
}
</script>

<style scoped lang="css">
.v-btn {
    min-width: 40px !important;
}
</style>
