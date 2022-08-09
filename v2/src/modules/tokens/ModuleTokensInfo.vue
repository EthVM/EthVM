<template>
    <v-card variant="flat">
        <app-table-title title="Tokens" title-caption="Top 200 tokens" :has-pagination="!smAndDown" page-type="">
            <template #pagination>
                <app-paginate v-if="totalPages > 1" :total="totalPages" :current-page="state.index" class="pb-2" @newPage="setPage" />
            </template>
        </app-table-title>
        <v-container fluid>
            <v-card color="info" variant="flat" min-height="40">
                <v-row align="center" justify="start" class="ma-0">
                    <v-col cols="4">
                        <v-row align="center" class="ma-0">
                            <h5 class="pl-5 pr-2">Token</h5>
                            <app-btn-icon
                                v-if="state.sortDirection === 'asc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_SYMBOL }"
                                icon="arrow_upward"
                                @click="sortTokens(KEY_SYMBOL, 'desc')"
                            />
                            <app-btn-icon
                                v-if="state.sortDirection === 'desc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_SYMBOL }"
                                icon="arrow_downward"
                                @click="sortTokens(KEY_SYMBOL, 'asc')"
                            />
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row align="center" class="ma-0">
                            <h5 class="pl-5 pr-2">Price</h5>
                            <app-btn-icon
                                v-if="state.sortDirection === 'asc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_PRICE }"
                                icon="arrow_upward"
                                @click="sortTokens(KEY_PRICE, 'desc')"
                            />
                            <app-btn-icon
                                v-if="state.sortDirection === 'desc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_PRICE }"
                                icon="arrow_downward"
                                @click="sortTokens(KEY_PRICE, 'asc')"
                            />
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row align="center" class="ma-0">
                            <h5 class="pl-5 pr-2">%Change (24H)</h5>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row align="center" class="ma-0">
                            <h5 class="pl-5 pr-2">Volume</h5>
                            <app-btn-icon
                                v-if="state.sortDirection === 'asc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_VOLUME }"
                                icon="arrow_upward"
                                @click="sortTokens(KEY_VOLUME, 'desc')"
                            />
                            <app-btn-icon
                                v-if="state.sortDirection === 'desc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_VOLUME }"
                                icon="arrow_downward"
                                @click="sortTokens(KEY_VOLUME, 'asc')"
                            />
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row align="center" class="ma-0">
                            <h5 class="pl-5 pr-2">Market Cap</h5>
                            <app-btn-icon
                                v-if="state.sortDirection === 'asc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_MARKET_CAP }"
                                icon="arrow_upward"
                                @click="sortTokens(KEY_MARKET_CAP, 'desc')"
                            />
                            <app-btn-icon
                                v-if="state.sortDirection === 'desc'"
                                class="sort"
                                :class="{ 'sort--active': state.sortKey === KEY_MARKET_CAP }"
                                icon="arrow_downward"
                                @click="sortTokens(KEY_MARKET_CAP, 'asc')"
                            />
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
            <div v-if="tokensInPage.length > 0" class="my-2 text-body-1">
                <div v-for="token in tokensInPage" :key="token.symbol">
                    <v-row align="center" justify="start" class="ma-0">
                        <v-col cols="4">
                            <v-row align="center" class="ma-0">
                                <div class="mr-2">
                                    <v-img :src="getTokenImage(token)" width="25px" height="25px" />
                                </div>
                                <router-link v-if="token.symbol || token.name" :to="`/token/${token.contract}`" class="text-body-1">
                                    <span v-if="token.symbol" class="font-weight-medium text-uppercase">{{ token.symbol }} - </span>
                                    <span class="font-weight-regular">{{ token.name }}</span>
                                </router-link>
                                <div v-else>
                                    <p>Contract:</p>
                                    <app-transform-hash :hash="eth.toCheckSum(token.contract)" :link="`/token/${token.contract}`" />
                                </div>
                            </v-row>
                        </v-col>
                        <v-col cols="2">
                            <v-row align="center" class="ma-0 pl-5">
                                <p class="mb-0">
                                    {{ getTokenPrice(token).value }}
                                    <app-tooltip v-if="getTokenPrice(token).tooltipText" :text="getTokenPrice(token).tooltipText" />
                                </p>
                            </v-row>
                        </v-col>
                        <v-col cols="2">
                            <v-row align="center" class="ma-0 pl-5">
                                <p :class="priceChangeClass(token)">{{ percentageChange(token).value }}%</p>
                                <v-icon v-if="!isPositivePriceChange(token)" color="error" size="x-small">south_east</v-icon>
                                <v-icon v-else color="success" size="x-small">north_east</v-icon>
                                <app-tooltip v-if="percentageChange(token).tooltip" :text="percentageChange(token).tooltip" />
                            </v-row>
                        </v-col>
                        <v-col cols="2">
                            <v-row align="center" class="ma-0 pl-5">
                                <p class="mb-0">
                                    {{ getTokenVolume(token).value }}
                                    <app-tooltip v-if="getTokenVolume(token).tooltipText" :text="getTokenVolume(token).tooltipText" />
                                </p>
                            </v-row>
                        </v-col>
                        <v-col cols="2">
                            <v-row align="center" class="ma-0 pl-5">
                                <p class="mb-0">
                                    {{ getTokenMarketCap(token).value }}
                                    <app-tooltip v-if="getTokenMarketCap(token).tooltipText" :text="getTokenMarketCap(token).tooltipText" />
                                </p>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-divider />
                </div>
            </div>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import AppTableTitle from '@core/components/AppTableTitle.vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { useDisplay } from 'vuetify'
import { computed, watch, reactive, onMounted } from 'vue'
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
    tokens: TokensSorted
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
    tokens: []
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

const getCurrentCoinData = (): Array<TokenMarketData | null> => {
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

const tokensInPage = computed<Array<TokenMarketData | null>>(() => {
    const start = state.index * state.maxItems
    if (!store.loadingCoinData && state.tokens) {
        const end = start + state.maxItems > state.tokens.length ? state.tokens.length : start + state.maxItems
        return state.tokens.slice(start, end)
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

const isPositivePriceChange = (token: TokenMarketData): boolean => {
    const change = token.price_change_percentage_24h || 0
    return change > 0
}
const priceChangeClass = (token: TokenMarketData): string => {
    const change = token.price_change_percentage_24h || 0

    if (change > 0) {
        return 'text-green pl-2'
    }
    if (change < 0) {
        return 'text-red pl-2'
    }
    return 'black--text pl-2'
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
    state.tokensByMarketCap = new TokensSorted(ethereumTokens.value, KEY_MARKET_CAP)
    state.tokens = state.tokensByMarketCap.descend
    state.tokensByPrice = new TokensSorted(state.tokensByMarketCap.ascend, KEY_PRICE)
    state.tokensBySymbol = new TokensSorted(state.tokensByMarketCap.ascend, KEY_SYMBOL)
    state.tokensByVolume = new TokensSorted(state.tokensByMarketCap.ascend, KEY_VOLUME)
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
.sort {
    opacity: 0;
    &:hover:not(.sort--active) {
        opacity: 0.5;
    }

    &--active {
        opacity: 1;
    }
}
</style>
