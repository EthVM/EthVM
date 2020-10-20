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
        <v-layout align-center justify-start row pl-4 pr-3 pb-2>
            <v-spacer />
            <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="isLoading || hasError" :txs-data="adrList" :is-scroll-view="false">
            <template #header>
                <fav-addr-table-header :delete-mode="deleteMode" :all-selected="isAllSelected" :delete-array="deleteArray" @selectAllInHeader="removeAll" />
            </template>
            <template #rows>
                <v-card v-for="adr in adrList" :key="adr.hash" class="transparent" flat>
                    <fav-addr-table-row-handler
                        :ether-price="ethPrice"
                        :hash="adr.address"
                        :name="adr.name"
                        :delete-mode="deleteMode"
                        :delete-array="deleteArray"
                        :check-box-method="updateDeleteArray"
                    />
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
            update: data => data.favAddresses
        }
    }
})
export default class FavHandlerAddressListRow extends Mixins(CoinData) {
    pageType = 'fav_addresses'
    index = 0
    favAddresses!: favAddressesType[]
    hasError = false
    maxItems = 10
    deleteMode = false
    deleteArray: string[] = []
    isAllSelected = false

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
            return this.favAddresses.slice(start, end)
        }
        return []
    }
    get totalPages(): number {
        if (this.favAddresses && this.favAddresses.length) {
            return Math.ceil(new BN(this.favAddresses.length).div(this.maxItems).toNumber())
        }
        return 0
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
        this.deleteMode = !this.deleteMode
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
}
</script>
