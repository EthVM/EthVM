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
            <app-table-title :title="title" :has-pagination="false" :page-type="pageType" :title-caption="titleCaption" page-link="" class="pl-2" />
            <v-spacer hidden-xs-only />
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
        <!--
        =====================================================================================
        SM AND UP: Search / Pagination
        =====================================================================================
        -->
        <v-layout align-center justify-start row hidden-xs-only px-2 my-2>
            <v-flex xs12 sm6 md7 pr-0>
                <fav-search :items="favAddresses" :loading="isLoading" @search="onSearch" />
            </v-flex>
            <v-spacer hidden-sm-and-down />
            <v-flex shrink py-0 pl-1>
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
          Mobile (xs-only): Search / Pagination
        =====================================================================================
        -->
        <v-layout grid-list-xs align-center justify-center hidden-sm-and-up row wrap pr-2 pl-2 mb-3>
            <v-flex xs12 pb-0 pt-0>
                <app-filter :options="options" :show-desktop="false" :is-sort="true" @onSelectChange="sortAddresses" />
            </v-flex>
            <v-flex xs12 pb-0 pt-0>
                <fav-search :items="favAddresses" :loading="isLoading" @search="onSearch" />
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
            :txs-data="adrList"
            :is-scroll-view="false"
            :table-message="message"
        >
            <template #header>
                <fav-tokens-table-header
                    :loading="isLoading"
                    :delete-mode="deleteMode"
                    :all-selected="isAllSelected"
                    :delete-array="deleteArray"
                    @sortBy="sortAddresses"
                    @selectAllInHeader="removeAll"
                />
            </template>
            <template #rows>
                <v-card v-for="adr in adrList" :key="adr.hash" class="transparent" flat>
                    <fav-tokens-table-row-handler
                        :ether-price="ethPrice"
                        :hash="adr.address"
                        :name="adr.name"
                        :delete-mode="deleteMode"
                        :delete-array="deleteArray"
                        :check-box-method="updateDeleteArray"
                        @errorFavorites="emitErrorState"
                        @addressChips="updateChips"
                    />
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
import FavTokenTableRowHandler from '@app/modules/favorite-tokens/handlers/FavHandlerTokenListRow.vue'
import FavSearch from '@app/modules/favorite-tokens/components/FavSearch.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { FavActions as FavActionsMixin } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { favAddressCache } from '@app/apollo/favorites/rootQuery.graphql'
import { favAddressCache_favAddresses as favAddressesType } from '@app/apollo/favorites/apolloTypes/favAddressCache'
import { EnumAdrChips } from '@app/core/components/props'
import { FILTER_VALUES, FavSort } from '@app/modules/favorite-tokens/models/FavSort'
import AppFilter from '@app/core/components/ui/AppFilter.vue'
import { DataArray } from '@app/apollo/favorites/models'

import BN from 'bignumber.js'

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        FavTokensTableHeader,
        FavTokenTableRowHandler,
        FavSearch,
        TableTxs,
        AppFilter
    },
    apollo: {
        favAddresses: {
            query: favAddressCache,
            client: 'FavClient',
            fetchPolicy: 'network-only',
            update: data => data.favAddresses,
            result({ data }) {
                if (data && data.favAddresses) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.addressCheck)
            }
        }
    }
})
export default class FavHandlerAddressListRow extends Mixins(CoinData, FavActionsMixin) {
    /*
    ===================================================================================
      Data:
    ===================================================================================
    */
    pageType = 'fav_addresses'
    index = 0
    favAddresses!: favAddressesType[]
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
                text: this.$i18n.tc('fav.sort.address'),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[1],
                text: this.$i18n.tc('fav.sort.address'),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[2],
                text: this.$i18n.tc('fav.sort.name'),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[3],
                text: this.$i18n.tc('fav.sort.name'),
                filter: this.$i18n.t('filter.low')
            }
        ]
    }

    get title(): string {
        const isPlural = this.totalAddr && this.totalAddr > 1 ? 2 : 1
        return `${this.$tc('token.name', 1)} ${this.$tc('token.favorite', isPlural)}`
    }
    get totalAddr(): number | null {
        return this.favorites ? this.favorites.length : null
    }
    get isLoading(): boolean {
        return this.$apollo.queries.favAddresses.loading
    }
    get hasFavAdr(): boolean {
        return this.totalPages > 0
    }
    get adrList(): favAddressesType[] {
        if (!this.isLoading || this.hasFavAdr) {
            this.sort !== '' ? this.favSort.sortFavorites(this.favorites, this.sort) : ''
            const start = this.searchVal ? 0 : this.index * this.maxItems
            const end = start + this.maxItems > this.favorites.length ? this.favorites.length : start + this.maxItems
            return this.favorites.slice(start, end)
        }
        return []
    }
    get totalPages(): number {
        if (this.favorites && this.favorites.length) {
            return Math.ceil(new BN(this.favorites.length).div(this.maxItems).toNumber())
        }
        return 0
    }
    get favorites(): favAddressesType[] {
        const searchResults = this.searchVal
            ? this.favAddresses.filter(item => item.name.toLowerCase().includes(this.searchVal) || item.address.toLowerCase().includes(this.searchVal))
            : []
        return searchResults && this.searchVal ? searchResults : this.favAddresses
    }
    get message(): string {
        if (!this.isLoading) {
            if (this.searchVal && (!this.totalAddr || this.totalAddr < 1)) {
                return this.$t('fav.message.no-search-results').toString()
            }
            if (!this.totalAddr || this.totalAddr < 1) {
                return this.$t('fav.message.no-addr').toString()
            }
        }
        return ''
    }

    get titleCaption(): string {
        return `${this.$t('contract.total')}: ${this.totalAddr}`
    }

    get favSort(): FavSort {
        return new FavSort(this.favorites)
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    hasAddress(address: string): boolean {
        const foundItems = this.favAddresses.find(i => i.address === address)
        return foundItems ? true : false
    }
    sortAddresses(sort: string): void {
        this.sort = sort
    }
    emitErrorState(val: boolean, message: string): void {
        this.hasError = val
        this.$emit('errorFavorites', this.hasError, message)
    }

    onSearch(val): void {
        this.searchVal = val ? val.toLowerCase() : null
    }
    addItem(item): void {
        this.mixinAddToFav(item.name, item.address)
    }
    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.index = 0
        } else {
            this.index = page
        }
    }
    updateDeleteArray(newArray: string[]): void {
        this.deleteArray = newArray
        if (this.deleteArray.length === this.totalAddr) {
            this.isAllSelected = true
        }
        if (this.deleteArray.length !== this.totalAddr) {
            this.isAllSelected = false
        }
    }
    removeAll(): void {
        this.isAllSelected = !this.isAllSelected
        if (this.isAllSelected) {
            this.deleteArray = this.favAddresses.map(i => i.address)
        } else {
            this.deleteArray = []
        }
    }
    deleteAddrs(): void {
        this.deleteArray.forEach(_hash => {
            this.mixinRemoveFromFav(_hash)
        })
        this.deleteMode = false
        this.deleteArray = []
    }
    updateChips(chips: EnumAdrChips[], hash: string): void {
        this.addressChipsMap.set(hash, chips)
    }
}
</script>

<style scoped lang="css">
.v-btn {
    min-width: 40px !important;
}
</style>
