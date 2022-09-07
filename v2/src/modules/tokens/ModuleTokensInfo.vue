<template>
    <div>
        <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
            <v-card-title class="pa-0">
                <h1 class="text-h4 font-weight-bold">Token Market</h1>
            </v-card-title>
            <v-row class="mt-5 mb-10">
                <v-col md="6">
                    <v-text-field
                        v-model="state.tokenSearch"
                        class="search-field"
                        placeholder="Search tokens"
                        prepend-inner-icon="search"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row align="center" justify="start" class="text-body-1 text-info my-0">
                <v-col md="3">
                    <v-row align="center" class="ma-0">
                        <p>Token</p>
                        <app-btn-icon
                            v-if="state.sortDirection === 'asc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_SYMBOL }"
                            icon="arrow_upward"
                            @click="sortTokens(KEY_SYMBOL, 'desc')"
                        />
                        <app-btn-icon
                            v-if="state.sortDirection === 'desc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_SYMBOL }"
                            icon="arrow_downward"
                            @click="sortTokens(KEY_SYMBOL, 'asc')"
                        />
                    </v-row>
                </v-col>
                <v-col md="2">
                    <v-row align="center" class="ma-0">
                        <p>Price</p>
                        <app-btn-icon
                            v-if="state.sortDirection === 'asc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_PRICE }"
                            icon="arrow_upward"
                            @click="sortTokens(KEY_PRICE, 'desc')"
                        />
                        <app-btn-icon
                            v-if="state.sortDirection === 'desc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_PRICE }"
                            icon="arrow_downward"
                            @click="sortTokens(KEY_PRICE, 'asc')"
                        />
                    </v-row>
                </v-col>
                <v-col md="2"> %Change (24H) </v-col>
                <v-col md="2">
                    <v-row align="center" class="ma-0">
                        <p>Volume</p>
                        <app-btn-icon
                            v-if="state.sortDirection === 'asc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_VOLUME }"
                            icon="arrow_upward"
                            @click="sortTokens(KEY_VOLUME, 'desc')"
                        />
                        <app-btn-icon
                            v-if="state.sortDirection === 'desc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_VOLUME }"
                            icon="arrow_downward"
                            @click="sortTokens(KEY_VOLUME, 'asc')"
                        />
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row align="center" class="ma-0">
                        <p>Market Cap</p>
                        <app-btn-icon
                            v-if="state.sortDirection === 'asc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_MARKET_CAP }"
                            icon="arrow_upward"
                            @click="sortTokens(KEY_MARKET_CAP, 'desc')"
                        />
                        <app-btn-icon
                            v-if="state.sortDirection === 'desc'"
                            class="sort-button"
                            :class="{ 'sort-button--active': state.sortKey === KEY_MARKET_CAP }"
                            icon="arrow_downward"
                            @click="sortTokens(KEY_MARKET_CAP, 'asc')"
                        />
                    </v-row>
                </v-col>
                <v-col md="1"> Watchlist </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <div v-if="tokensInPage.length > 0">
                <div v-for="token in tokensInPage" :key="token.symbol">
                    <v-row align="center" justify="start" class="my-5">
                        <v-col md="3">
                            <v-row align="center" class="ma-0">
                                <div class="mr-4">
                                    <v-img :src="getTokenImage(token)" width="25px" height="25px" />
                                </div>
                                <router-link v-if="token.symbol || token.name" :to="`/token/${token.contract}`" class="text-body-1 text-link">
                                    <p class="text-textPrimary">{{ token.name }}</p>
                                    <span v-if="token.symbol" class="text-info text-uppercase">{{ token.symbol }}</span>
                                </router-link>
                                <div v-else>
                                    <p>Contract:</p>
                                    <app-transform-hash :hash="eth.toCheckSum(token.contract)" :link="`/token/${token.contract}`" />
                                </div>
                            </v-row>
                        </v-col>
                        <v-col md="2">
                            <v-row align="center" class="ma-0">
                                <p class="mb-0">
                                    {{ getTokenPrice(token).value }}
                                </p>
                            </v-row>
                        </v-col>
                        <v-col md="2">
                            <p :class="priceChangeClass(token)">{{ percentageChange(token).value }}%</p>
                        </v-col>
                        <v-col md="2">
                            <v-row align="center" class="ma-0">
                                <p class="mb-0">
                                    {{ getTokenVolume(token).value }}
                                </p>
                            </v-row>
                        </v-col>
                        <v-col md="2">
                            <v-row align="center" class="ma-0">
                                <p class="mb-0">
                                    {{ getTokenMarketCap(token).value }}
                                </p>
                            </v-row>
                        </v-col>
                        <v-col md="1">
                            <app-btn-icon
                                :icon="favoriteTokens.has(token.contract) ? 'star' : 'star_outline'"
                                @click="setFavoriteTokens(token.contract)"
                                size="24"
                            />
                        </v-col>
                    </v-row>
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
        </v-card>
    </div>
</template>

<script setup lang="ts">
import AppTableTitle from '@core/components/AppTableTitle.vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { useDisplay } from 'vuetify'
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import BN from 'bignumber.js'
import { eth } from '@core/helper'
import { formatIntegerValue, formatPercentageValue, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'

const MAX_TOKENS = 200
const store = useStore()
const { smAndDown } = useDisplay()
const KEY_VOLUME = 'total_volume'
const KEY_SYMBOL = 'symbol'
const KEY_PRICE = 'current_price'
const KEY_MARKET_CAP = 'market_cap'

interface ComponentState {
    index: number
    maxItems: number
    sortKey: string
    sortDirection: string
    tokensByMarketCap: TokensSorted
    tokensByVolume: TokensSorted
    tokensBySymbol: TokensSorted
    tokensByPrice: TokensSorted
    tokens: TokenMarketData[]
    tokenSearch: string
}

const state: ComponentState = reactive({
    index: 0,
    maxItems: 20,
    sortKey: 'market_cap',
    sortDirection: 'desc',
    tokensByMarketCap: [],
    tokensByVolume: [],
    tokensBySymbol: [],
    tokensByPrice: [],
    tokens: [],
    tokenSearch: ''
})

const { ethereumTokens } = useCoinData()

class TokensSorted {
    /* Properties: */
    ascend: TokenMarketData[]
    descend: TokenMarketData[]
    /* Constructor: */
    constructor(data: TokenMarketData[], sortKey: string) {
        this.descend = sortKey === 'symbol' ? this.sortByKeyDesendSymbol([...data], sortKey) : this.sortByKeyDesend([...data], sortKey)
        if (this.descend.length > MAX_TOKENS) {
            this.descend = this.descend.slice(0, MAX_TOKENS)
        }
        this.ascend = [...this.descend].reverse()
    }
    /* Method to sort object array in descending order by Key: */
    sortByKeyDesend(data: TokenMarketData[], key: string) {
        return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
    }
    sortByKeyDesendSymbol(data: TokenMarketData[], key: string) {
        return data.sort((x, y) => (y[key].toLowerCase() < x[key].toLowerCase() ? -1 : y[key].toLowerCase() > x[key].toLowerCase() ? 1 : 0))
    }
    getAscend(): TokenMarketData[] {
        return this.ascend
    }
    getDescend(): TokenMarketData[] {
        return this.descend
    }
}

const getCurrentCoinData = (): TokensSorted => {
    switch (state.sortKey) {
        case KEY_PRICE:
            return state.tokensByPrice
        case KEY_SYMBOL:
            return state.tokensBySymbol
        case KEY_VOLUME:
            return state.tokensByVolume
        default:
            return state.tokensByMarketCap
    }
}

const tokenFilteredByName = computed<Array<TokenMarketData | null>>(() => {
    if (!store.loadingCoinData && state.tokens) {
        return state.tokens.filter(token => {
            const searchText = state.tokenSearch.toLowerCase()
            const tokenSymbol = token.symbol.toLowerCase()
            const tokenName = token.name.toLowerCase()
            return tokenSymbol.includes(searchText) || tokenName.includes(searchText)
        })
    }
    return []
})

const tokensInPage = computed<Array<TokenMarketData | null>>(() => {
    const start = state.index * state.maxItems
    if (!store.loadingCoinData && state.tokens) {
        const end = start + state.maxItems > tokenFilteredByName.value.length ? tokenFilteredByName.value.length : start + state.maxItems
        return tokenFilteredByName.value.slice(start, end)
    }
    return []
})

const totalPages = computed<number>(() => {
    return Math.ceil(new BN(state.tokens.length).div(state.maxItems).toNumber())
})

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 */
const setPage = (page: number): void => {
    state.index = page
}

const getTokenImage = (token: TokenMarketData): string => {
    return token.image || require('@/assets/icon-token.png')
}

const getTokenPrice = (token: TokenMarketData): FormattedNumber => {
    const price = token.current_price || 0
    return formatUsdValue(new BN(price))
}

const getTokenVolume = (token: TokenMarketData): FormattedNumber => {
    const volume = token.total_volume || 0
    return formatIntegerValue(new BN(volume))
}

const getTokenMarketCap = (token: TokenMarketData): FormattedNumber => {
    const marketCap = token.market_cap || 0
    return formatIntegerValue(new BN(marketCap))
}

const percentageChange = (token: TokenMarketData): FormattedNumber => {
    const change = token.price_change_percentage_24h || 0
    return formatPercentageValue(new BN(change))
}

const priceChangeClass = (token: TokenMarketData): string => {
    const change = token.price_change_percentage_24h || 0

    if (change > 0) {
        return 'text-success'
    }
    if (change < 0) {
        return 'text-error'
    }
    return 'text-textPrimary'
}

const sortTokens = (key: string, direction: string): void => {
    // Only change the direction if the sort key is the same
    if (state.sortKey === key) {
        state.sortDirection = direction
    }
    state.sortKey = key
    const coinData = getCurrentCoinData()
    if (state.sortDirection === 'asc') {
        state.tokens = coinData.ascend
    } else {
        state.tokens = coinData.descend
    }
}

const setTokensData = (): void => {
    if (ethereumTokens.value) {
        state.tokensByMarketCap = new TokensSorted(ethereumTokens.value, KEY_MARKET_CAP)
    }
    state.tokens = state.tokensByMarketCap.descend
    state.tokensByPrice = new TokensSorted(state.tokensByMarketCap.ascend, KEY_PRICE)
    state.tokensBySymbol = new TokensSorted(state.tokensByMarketCap.ascend, KEY_SYMBOL)
    state.tokensByVolume = new TokensSorted(state.tokensByMarketCap.ascend, KEY_VOLUME)
}

const favoriteTokens = ref(new Set())

const setFavoriteTokens = (tokenContract: string): void => {
    if (!favoriteTokens.value.has(tokenContract)) {
        favoriteTokens.value.add(tokenContract)
    } else {
        favoriteTokens.value.delete(tokenContract)
    }
}

watch(
    () => store.loadingCoinData,
    () => {
        setTokensData()
    }
)

onMounted(() => {
    if (!store.loadingCoinData && ethereumTokens) {
        setTokensData()
    }
})
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

.search-field {
    max-width: 536px;

    :deep(.v-input__control) {
        .v-field--variant-outlined .v-field__outline__end {
            border-radius: 30px;
            border-width: 0px;
            background-color: rgba(var(--v-theme-info), 0.5);
        }

        .v-field--variant-outlined .v-field__outline__start {
            display: none;
        }

        .v-field:hover {
            .v-field__outline {
                --v-field-border-opacity: 0.5;
            }
        }

        .v-field--focused {
            .v-field__outline {
                --v-field-border-opacity: 0.4;
            }
        }
    }
}
</style>
