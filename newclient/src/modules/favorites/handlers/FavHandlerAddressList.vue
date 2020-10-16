<template>
    <v-card color="white" flat class="pb-2">
        <!--
        =====================================================================================
          Desktop (sm-and-up): TITLE / ADD button / REMOVE button
          Mobile (xs-only): TITLE
        =====================================================================================
        -->
        <v-layout align-center justify-start row wrap pl-3 pr-3 mt-1>
            <app-table-title :title="title" :has-pagination="false" :page-type="pageType" page-link="" class="pl-2" />
            <v-flex v-if="!isLoading" shrink hidden-xs-only>
                <p class="text-xs-center mr-3">{{ $t('contract.total') }}: {{ totalAddr }}</p>
            </v-flex>
            <v-flex shrink pl-2 hidden-xs-only>
                <fav-btn-add :add-address="addItem" />
            </v-flex>
            <v-spacer hidden-xs-only />
            <v-flex shrink pl-2 hidden-xs-only>
                <fav-btn-remove :remove-address="removeItem" />
            </v-flex>
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
        <!--
        =====================================================================================
          Mobile (xs-only): ADD button / TOTAL / REMOVE button
        =====================================================================================
        -->
        <v-layout hidden-sm-and-up justify-space-between align-center pl-2 pr-2>
            <v-flex shrink>
                <fav-btn-add :add-address="addItem" />
            </v-flex>
            <v-flex grow>
                <p v-if="!isLoading" class="text-xs-center">{{ $t('contract.total') }}: {{ totalAddr }}</p>
            </v-flex>
            <v-flex shrink>
                <fav-btn-remove :remove-address="removeItem" />
            </v-flex>
        </v-layout>
        <v-layout :column="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm" align-center justify-start row pl-4 pr-3 pb-2>
            <fav-search :items="favAddresses" :loading="isLoading" @search="onSearch" />
            <v-spacer />
            <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="isLoading || hasError" :txs-data="adrList" :is-scroll-view="false">
            <template #header>
                <fav-addr-table-header />
            </template>
            <template #rows>
                <v-card v-for="adr in adrList" :key="adr.hash" class="transparent" flat>
                    <fav-addr-table-row-handler :ether-price="ethPrice" :hash="adr.address" :name="adr.name" />
                </v-card>
            </template>
        </table-txs>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorites/models/ErrorMessagesFav'
import { Crumb } from '@app/core/components/props'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import FavAddrTableHeader from '@app/modules/favorites/components/FavAddrTableHeader.vue'
import FavAddrTableRowHandler from '@app/modules/favorites/handlers/FavHandlerAddressListRow.vue'
import FavBtnAdd from '@app/modules/favorites/components/FavBtnAdd.vue'
import FavBtnRemove from '@app/modules/favorites/components/FavBtnRemove.vue'
import FavSearch from '@app/modules/favorites/components/FavSearch.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { FavActions as FavActionsMixin } from '@app/modules/favorites/mixins/FavActions.mixin'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { favAddressCache } from '@app/apollo/favorites/rootQuery.graphql'
import { favAddressCache_favAddresses as favAddressesType } from '@app/apollo/favorites/apolloTypes/favAddressCache'
import BN from 'bignumber.js'

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        FavBtnAdd,
        FavBtnRemove,
        FavAddrTableHeader,
        FavAddrTableRowHandler,
        FavSearch,
        TableTxs
    },
    apollo: {
        favAddresses: {
            query: favAddressCache,
            client: 'FavClient',
            fetchPolicy: 'cache-and-network',
            update: data => data.favAddresses
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
    items!: favAddressesType[]
    hasError = false
    maxItems = 10
    searchVal = ''

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get title(): string {
        return this.$t('fav.title').toString()
    }
    get totalAddr(): number | null {
        return this.favorites ? this.favorites.length : null
    }

    get isLoading(): boolean {
        return this.favorites === undefined
    }
    get hasFavAdr(): boolean {
        return this.totalPages > 0
    }
    get adrList(): favAddressesType[] {
        if (!this.isLoading || this.hasFavAdr) {
            const start = this.index * this.maxItems
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
        this.items = this.searchVal
            ? this.favAddresses.filter(item => item.name.toLowerCase().includes(this.searchVal) || item.address.toLowerCase().includes(this.searchVal))
            : []
        return this.items && this.searchVal ? this.items : this.favAddresses
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    onSearch(val): void {
        this.searchVal = val ? val.toLowerCase() : null
    }
    addItem(item): void {
        this.mixinAddToFav(item.name, item.address).then(res => {
            if (res) {
                this.$apollo.queries.favAddresses.refresh()
            }
        })
    }
    removeItem(): void {
        console.log('remove item')
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
