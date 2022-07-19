<template>
    <v-card>
        <v-card-title class="justify-space-between">
            HRC20 token balance
            <app-paginate v-if="!loadingTokens" :total="totalPages" :current-page="state.index" @newPage="setPage" />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0 bg-primary">
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Token
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('name')">
                            <v-icon v-if="state.sortKey === `name_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Symbol
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('symbol')">
                            <v-icon v-if="state.sortKey === `symbol_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Balance
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('balance')">
                            <v-icon v-if="state.sortKey === `balance_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        USD Value
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('amount_usd')">
                            <v-icon v-if="state.sortKey === `amount_usd_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0 flex-nowrap" align="center">
                        24HR
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('change')">
                            <v-icon v-if="state.sortKey === `change_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center">
                        Price
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('price')">
                            <v-icon v-if="state.sortKey === `price_${state.sortDirection}` && state.sortDirection === 'high'">mdi-chevron-down</v-icon>
                            <v-icon v-else>mdi-chevron-up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="1">More</v-col>
            </v-row>
            <v-divider />
            <template v-if="loadingTokens">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </div>
            </template>
            <template v-else>
                <v-row v-for="token in tokens" :key="token.contract" class="ma-0 text-subtitle-2 font-weight-regular" align="center">
                    <v-col cols="2">
                        <v-row class="ma-0" align="center">
                            <img :src="token.image || require('@/assets/icon-token.png')" alt="" height="24" width="24" class="mr-2" />
                            <span class="font-weight-medium">{{ token.name }}</span>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        {{ token.symbol }}
                    </v-col>
                    <v-col cols="2">{{ formatFloatingPointValue(token.balance).value }}</v-col>
                    <v-col cols="2">{{ formatFloatingPointValue(token.usdValue).value }}</v-col>
                    <v-col cols="1">
                        <v-row v-if="priceChangeFormatted(token)" class="ma-0">
                            <p v-if="priceChangeFormatted(token)" :class="priceChangeClass(token)">{{ priceChangeFormatted(token).value }}%</p>
                            <v-img
                                v-if="priceChangeFormatted(token) && change(token) > 0"
                                :src="require('@/assets/up.png')"
                                height="18px"
                                max-width="18px"
                                contain
                            ></v-img>
                            <v-img
                                v-if="priceChangeFormatted(token) && change(token) < 0"
                                :src="require('@/assets/down.png')"
                                height="18px"
                                max-width="18px"
                                contain
                            ></v-img>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <p v-if="token.current_price">
                            {{ token.current_price }}
                        </p>
                    </v-col>
                    <v-col cols="1">
                        <v-btn v-if="getEthereumTokenByContract(token.contract)" icon size="small" @click="showTokenDetails(token.contract)">
                            <v-icon v-if="state.showMoreTokenDetails && state.activeToken.contract === token.contract">mdi-chevron-up</v-icon>
                            <v-icon v-else>mdi-chevron-down</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col v-if="state.showMoreTokenDetails && state.activeToken.contract === token.contract" cols="12">
                        <v-row class="mx-0">
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">Market Cap</p>
                                    <p>{{ BN(state.activeToken.market_cap).toFormat() }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">Circulating Supply</p>
                                    <p>{{ state.activeToken.total_supply }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">24 Hour Trading Vol</p>
                                    <p>{{ state.activeToken.total_volume }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                            <v-col cols="12">
                                <p v-if="count > 0">{{ count }} new points loaded</p>
                                <Line v-if="chartData" :chart-options="chartOptions" :chart-data="chartData" :height="200" />
                                <v-row justify="space-between" align="center" class="ma-0">
                                    <v-btn-toggle v-model="selectedAggregateModel" borderless mandatory color="primary" active-class="primary white--text">
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedAggregate === PREFIX.AVG">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedAggregate === PREFIX.AVG" />
                                            <span v-else> avg </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedAggregate === PREFIX.MAX">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedAggregate === PREFIX.MAX" />
                                            <span v-else> max </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedAggregate === PREFIX.MIN">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedAggregate === PREFIX.MIN" />
                                            <span v-else> min </span>
                                        </v-btn>
                                    </v-btn-toggle>
                                    <v-btn-toggle v-model="selectedTimeSeriesModel" borderless mandatory color="primary" active-class="primary white--text">
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedTimeSeriesModel === 0">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedTimeSeriesModel === 0" />
                                            <span v-else> Hour </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedTimeSeriesModel === 1">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedTimeSeriesModel === 1" />
                                            <span v-else> Day </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedTimeSeriesModel === 2">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedTimeSeriesModel === 2" />
                                            <span v-else> Week </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedTimeSeriesModel === 3">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedTimeSeriesModel === 3" />
                                            <span v-else> Month </span>
                                        </v-btn>
                                        <v-btn size="small" :disabled="loadingChartPoints && selectedTimeSeriesModel === 4">
                                            <v-progress-circular indeterminate v-if="loadingChartPoints && selectedTimeSeriesModel === 4" />
                                            <span v-else> Year </span>
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-divider />
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import { TokenOwnersFragment, useGetOwnersErc20TokensQuery } from '@module/address/apollo/tokens.generated'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, TokenSort, Token } from '@module/address/models/TokenSort'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'
import { useTokenBalanceChange } from '@module/address/composable/chart/token-change.composable'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)
const { getEthereumTokensMap, loading: loadingEthTokens, getEthereumTokenByContract } = useCoinData()

const MAX_ITEMS = 10
const PREFIX = {
    AVG: 'ACCOUNT_BALANCE_PREFIX_AVG',
    MIN: 'ACCOUNT_BALANCE_PREFIX_MIN',
    MAX: 'ACCOUNT_BALANCE_PREFIX_MAX'
}

const props = defineProps({
    addressHash: {
        type: String,
        required: true
    }
})

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: false | TokenMarketData
    sortKey: string
    sortDirection: string
    index: number
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: false,
    sortKey: TOKEN_FILTER_VALUES[1],
    sortDirection: 'high',
    index: 0
})

let width, height, gradient
const getGradient = (ctx: CanvasRenderingContext2D, chartArea) => {
    const chartWidth = chartArea.right - chartArea.left
    const chartHeight = chartArea.bottom - chartArea.top
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth
        height = chartHeight
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, 'white')
        gradient.addColorStop(0.9, 'rgba(5, 192, 165, 0.32)')
    }

    return gradient
}

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            // type: 'time',
            display: true,
            distribution: 'series',
            scaleLabel: {
                display: true,
                labelString: 'Date'
            },
            // time: {
            //     unit: 'day'
            // },
            ticks: {
                beginAtZero: false,
                major: {
                    fontStyle: 'bold',
                    fontColor: '#FF0000'
                }
            },
            grid: {
                display: false
            }
        },
        y: {
            display: false,
            scaleLabel: {
                display: true,
                labelString: 'Value'
            },
            ticks: {
                beginAtZero: true
            },
            grid: {
                display: false
            }
        }
    }
})

const tokenContract = ref('')
const selectedAggregateModel = ref(0)
const selectedTimeSeriesModel = ref(4)

const selectedAggregate = computed<string>(() => {
    switch (selectedAggregateModel.value) {
        case 0:
            return PREFIX.AVG
        case 1:
            return PREFIX.MAX
        default:
            return PREFIX.MIN
    }
})
const {
    result: balanceChange,
    chartPoints,
    loading: loadingChartPoints,
    onNewTimeSeriesData
} = useTokenBalanceChange(selectedAggregate, tokenContract, props.addressHash, selectedTimeSeriesModel)

const count = ref(0)
onNewTimeSeriesData(data => {
    console.log(data)
    count.value += 1
})

const chartData = computed(() => {
    // const { result: balanceChange, chartPoints } = useTokenBalanceChange('ACCOUNT_BALANCE_PREFIX_AVG', '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', props.addressHash)
    if (tokenContract.value) {
        return {
            datasets: [
                {
                    label: 'Balance Change',
                    fill: true,
                    backgroundColor: context => {
                        const chart = context.chart
                        const { ctx, chartArea } = chart
                        if (!chartArea) {
                            return
                        }
                        return getGradient(ctx, chartArea)
                    },
                    data: chartPoints.value,
                    tension: 0.5
                }
            ]
        }
    }
    return {}
})

const { result: erc20TokensResult, loading: loadingTokens } = useGetOwnersErc20TokensQuery({
    hash: props.addressHash
})

const erc20Tokens = computed<Array<TokenOwnersFragment | null> | undefined>(() => {
    return erc20TokensResult.value?.getOwnersERC20Tokens.owners
})

/**
 * Gets an object with all sorted arrays
 *
 * @returns false OR Map<string, TokenMarketData>  if values have been loaded
 * @returns  null  otherwise
 */
const tokenPrices = computed<Map<string, TokenMarketData> | false | null>(() => {
    if (!loadingTokens.value && erc20Tokens.value && !loadingEthTokens.value) {
        const contracts: string[] = []
        erc20Tokens.value.forEach(token => {
            if (token) {
                contracts.push(token.tokenInfo.contract)
            }
        })
        if (contracts.length > 0) {
            return getEthereumTokensMap(contracts)
        }
    }
    return null
})

const hasTokens = computed<boolean>(() => {
    return !!erc20Tokens.value
})

/**
 * Gets an object with all sorted arrays
 * @param {String} contract
 * @returns
 * - TokenSort if all has been loaded
 * - false if still loading
 */

const tokenSort = computed<TokenSort | false>(() => {
    if (!loadingTokens.value && erc20Tokens.value && tokenPrices.value !== null) {
        return new TokenSort(erc20Tokens.value, tokenPrices.value, true)
    }
    return false
})

const sortTable = (key: string): void => {
    state.sortDirection = state.sortDirection === 'high' ? 'low' : 'high'
    state.sortKey = `${key}_${state.sortDirection}`
}

const tokens = computed(() => {
    const start = MAX_ITEMS * state.index
    if (!loadingTokens.value && hasTokens.value && tokenSort.value) {
        const end = start + MAX_ITEMS > erc20Tokens.value?.length ? erc20Tokens.value?.length : start + MAX_ITEMS
        return tokenSort.value?.getSortedTokens(state.sortKey).slice(start, end)
    }
    return []
})

const totalPages = computed<number>(() => {
    return Math.ceil(new BN(erc20Tokens.value?.length).div(MAX_ITEMS).toNumber())
})

const priceChangeFormatted = (token: Token): FormattedNumber | null => {
    return token.price_change_percentage_24h ? formatPercentageValue(new BN(token.price_change_percentage_24h)) : null
}

const change = (token: Token): number => {
    if (!token.price_change_percentage_24h || token.price_change_percentage_24h === 0) {
        return 0
    } else if (token.price_change_percentage_24h > 0) {
        return 1
    }
    return -1
}

const priceChangeClass = (token: Token): string => {
    if (change(token) === 0) {
        return 'text-black'
    } else if (change(token) > 0) {
        return 'text-green'
    }
    return 'text-red'
}

const showTokenDetails = (contract: string) => {
    if (state.activeToken?.contract === contract && state.showMoreTokenDetails) {
        state.showMoreTokenDetails = false
        return
    }
    state.showMoreTokenDetails = true
    state.activeToken = getEthereumTokenByContract(contract)
    tokenContract.value = contract
}

const setPage = (page: number, reset: boolean) => {
    state.index = page
}
</script>
