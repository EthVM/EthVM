<template>
    <v-card color="white" flat class="pb-2">
        <v-layout align-center justify-center row pl-3 pr-3 mt-1>
            <app-table-title :title="title" :has-pagination="false" :page-type="pageType" page-link="" class="pl-2" />
            <fav-btn-add :add-address="addItem" />
            <v-spacer />
            <fav-btn-remove :remove-address="removeItem" />
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
        <v-layout align-center justify-start row pl-4 pr-3 pb-2>
            <p v-if="!isLoading">Total: {{ totalAddr }}</p>
            <v-spacer />
            <app-paginate :total="2" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="isLoading || hasError" :txs-data="adrList" :is-scroll-view="false">
            <template #header>
                <fav-addr-table-header />
            </template>
            <template #rows>
                <v-card v-for="(adr, index) in adrList" :key="index" class="transparent" flat>
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
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
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
        TableTxs
    },
    apollo: {
        favAddresses: {
            query: favAddressCache,
            client: 'FavClient',
            fetchPolicy: 'cache-and-network',
            update: data => data.favAddresses,
            result({ data }) {
                this.totalPages = Math.ceil(new BN(this.favAddresses.length).div(this.maxItems).toNumber())
            }
        }
    }
})
export default class FavHandlerAddressListRow extends Mixins(CoinData) {
    pageType = 'fav_addresses'
    index = 0
    favAddresses!: favAddressesType[]
    hasError = false
    maxItems = 10
    totalPages = 0
    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get title(): string {
        return this.$t('fav.title').toString()
    }
    get totalAddr(): number | null {
        return this.favAddresses ? this.favAddresses.length : null
    }

    get isLoading(): boolean {
        return this.favAddresses === undefined
    }
    get hasFavAdr(): boolean {
        return this.totalPages > 0
    }
    get adrList(): favAddressesType[] {
        if (!this.isLoading || this.hasFavAdr) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.favAddresses.length ? this.favAddresses.length : start + this.maxItems
            console.log(this.favAddresses)
            return this.favAddresses.slice(start, end)
        }
        return []
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    addItem(): void {
        console.log('adding item')
    }
    removeItem(): void {
        console.log('remove item')
    }
    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.index = 0
            this.totalPages = 0
        } else {
            this.index = page
        }
    }
}
</script>
