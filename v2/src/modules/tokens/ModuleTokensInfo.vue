<template>
    <div>
        <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
            <v-card-title class="pa-0">
                <h1 class="text-h4 font-weight-bold">Token Market</h1>
            </v-card-title>
            <app-tabs v-model="state.activeList" :routes="routes" :tabs="list" class="my-5" btn-variant></app-tabs>

            <v-row class="mb-10" align="center">
                <app-input place-holder="Search tokens" v-model="state.tokenSearch" />
                <module-add-fav-token v-if="state.activeList === list[1].value" />
            </v-row>
            <v-row align="center" justify="start" class="text-body-1 text-info my-0 d-none d-sm-flex">
                <v-col sm="6" md="4" lg="4">
                    <v-row align="center" class="ma-0">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                            Token <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-row>
                </v-col>
                <v-col sm="3" md="2">
                    <v-row align="center" class="ma-0">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PRICE)">
                            Price <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-row>
                </v-col>
                <v-col sm="3" md="2">
                    <v-btn
                        variant="text"
                        color="info"
                        class="font-weight-regular ml-n3"
                        rounded="pill"
                        size="small"
                        @click="sortTable(SORT_KEY.PERCENTAGE_CHANGE)"
                    >
                        %Change (24h)<v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                    ></v-col
                >
                <v-col md="2" class="d-none d-md-block">
                    <v-row align="center" class="ma-0">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.VOLUME)">
                            Volume <v-icon v-if="isActiveSort(SORT_KEY.VOLUME)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-row>
                </v-col>
                <v-col md="2" class="d-none d-md-block">
                    <v-row align="center" class="ma-0">
                        <v-btn
                            variant="text"
                            color="info"
                            class="font-weight-regular ml-n3"
                            rounded="pill"
                            size="small"
                            @click="sortTable(SORT_KEY.MARKET_CAP)"
                        >
                            Market Cap <v-icon v-if="isActiveSort(SORT_KEY.MARKET_CAP)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-row>
                </v-col>
                <!-- <v-col sm="2" lg="1"> Watchlist </v-col> -->
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <template v-if="!loadingCoinData">
                <div v-if="tokensInPage.length > 0">
                    <div v-for="token in currentPageData" :key="token.contract">
                        <token-market-info-table-row v-if="token" :token="token" />
                    </div>
                </div>
                <div v-else>
                    <v-row justify="center" class="my-0">
                        <v-col md="10" class="bg-background rounded-lg mt-10 mb-8 py-12 text-center">
                            <v-icon>info</v-icon>
                            No results found. Please try again
                        </v-col>
                    </v-row>
                </div>
            </template>
            <template v-else>
                <div v-for="item in 10" :key="item" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                </div>
            </template>
            <template v-if="showPagination">
                <app-pagination :length="numberOfPages" @update:modelValue="loadMoreData" :current-page="pageNum" />
            </template>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import AppTabs from '@core/components/AppTabs.vue'
import AppInput from '@core/components/AppInput.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { Tab } from '@/core/components/props'
import TokenMarketInfoTableRow from '@module/tokens/components/TokenMarketInfo/TableRowTokenMarketInfo.vue'
import ModuleAddFavToken from './ModuleAddFavToken.vue'
import { useDisplay } from 'vuetify'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { TOKEN_FILTER_VALUES, KEY, DIRECTION, TokenSortMarket, TokenMarket } from '@module/address/models/TokenSort'

import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { searchHelper } from '@core/helper/search'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'

const routes = ADDRESS_ROUTE_QUERY.Q_NFTS

// const MAX_TOKENS = 200
const store = useStore()
const { smAndDown } = useDisplay()

const list: Tab[] = [
    {
        value: 'all',
        title: 'All'
    },
    {
        value: 'fav',
        title: 'Favorites'
    }
]

interface ComponentState {
    index: number
    maxItems: number
    sortKey: string
    sortDirection: string
    tokenSearch: string
    activeList: string
}

const state: ComponentState = reactive({
    index: 0,
    maxItems: 20,
    sortKey: TOKEN_FILTER_VALUES[13],
    sortDirection: DIRECTION.HIGH,
    tokenSearch: '',
    activeList: 'all'
})

const { tokensWithMarketCap, loading: loadingCoinData, getEthereumTokenByContract } = useCoinData()

const tokens = computed<TokenSortMarket | null>(() => {
    if (!store.loadingCoinData && tokensWithMarketCap) {
        const filtered = tokensWithMarketCap.value.filter((x): x is TokenMarketData => x !== null)
        let all = filtered.map(i => new TokenMarket(i))
        if (state.tokenSearch) {
            all = searchHelper(all, ['name', 'symbol', 'contract'], state.tokenSearch) as Array<TokenMarket>
        }
        const topTokens = new TokenSortMarket(all).getSortedTokens(TOKEN_FILTER_VALUES[13]).splice(0, 500)
        return new TokenSortMarket(topTokens)
    }
    return null
})

const favTokensSorted = computed<TokenSortMarket | null>(() => {
    if (!store.loadingCoinData) {
        const favs: TokenMarket[] = []
        store.favTokens.forEach(fav => {
            const market = getEthereumTokenByContract(fav) || undefined
            favs.push(new TokenMarket(market))
        })
        return new TokenSortMarket(favs)
    }
    return null
})

const tokensInPage = computed<TokenMarket[]>(() => {
    if (!store.loadingCoinData && tokens.value && favTokensSorted.value) {
        const viewable = state.activeList === list[0].value ? tokens.value : favTokensSorted.value
        return viewable.getSortedTokens(state.sortKey)
    }
    return []
})

const tabId = computed<string>(() => {
    return state.activeList === 'all' ? 'tabAllTokens' : 'tabFavoriteTokens'
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(tokensInPage, tabId, 50)

const showPagination = computed<boolean>(() => {
    return !store.loadingCoinData && tokensInPage.value.length > 0
})

const sortIcon = computed<string>(() => {
    return state.sortDirection === DIRECTION.HIGH ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}

const SORT_KEY = KEY

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 */
const loadMoreData = (page: number): void => {
    setPageNum(page)
}

const sortTable = (key: KEY): void => {
    state.sortDirection = state.sortDirection === DIRECTION.HIGH ? DIRECTION.LOW : DIRECTION.HIGH
    state.sortKey = `${key}_${state.sortDirection}`
}
</script>

<style scoped lang="scss">
.sort-button {
    opacity: 0;
    &:hover:not(.sort--active) {
        opacity: 0.5;
    }

    &--active {
        opacity: 1;
    }
}
</style>
