<template>
    <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
        <address-balance-totals title="Portfolio Value" :is-loading="isLoading" :balance="portfolioValue"> </address-balance-totals>
        <v-row class="mt-2" align="start">
            <v-col v-if="isLoading" cols="12">
                <div class="skeleton-box rounded-xl" style="min-height: 140px"></div>
            </v-col>
            <v-col v-if="!isLoading && portfolioValueBN.gt(0)" cols="12" sm="4" md="5">
                <chart-pie :chart-data="chartData" :loading="false"></chart-pie>
            </v-col>
            <v-divider v-if="!xs && !isLoading && portfolioValueBN.gt(0)" vertical class="my-2"></v-divider>
            <v-col v-if="!isLoading && portfolioValueBN.gt(0)" cols="12" sm="8" md="7">
                <v-row v-for="i in topTokens.slice(0, 4)" :key="i.symbol" justify="space-between" align="center">
                    <v-col class="d-flex align-center py-2">
                        <app-token-icon :token-icon="i.icon"></app-token-icon>
                        <p class="pl-3 text-button">{{ i.symbol }}</p>
                    </v-col>
                    <div class="token-percent rounded-xl px-2">
                        <p class="text-center text-info">{{ formatPercentageValue(i.percent).value }}%</p>
                    </div>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useAddressEthBalance } from '@core/composables/AddressEthBalance/addressEthBalance.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { computed } from 'vue'
import { formatUsdValue, formatPercentageValue } from '@/core/helper/number-format-helper'
import { useTheme } from 'vuetify/lib/framework.mjs'
import BN from 'bignumber.js'
import { ChartData } from 'chart.js'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import ChartPie from '@module/chart/components/ChartPie.vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'

const { xs } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { initialLoad: loadingTokensBalances, tokenTotalBalanceBN, tokenSort } = useAddressToken(props.addressRef)
const { initialLoad: loadingEthBalance, balanceFiatBN: ethBalance } = useAddressEthBalance(props.addressRef)
const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

/**------------------------
 * Prtfolio Value
 -------------------------*/

/**
 * Returns true when Token Balances, Eth Balance and Market data has been loaded,
 * false otherwise.
 */
const isLoading = computed<boolean>(() => {
    return loadingTokensBalances.value || loadingEthBalance.value || loadingMarketInfo.value
})

/**
 * Returns BigNumber for the total usd value of tokens + eth balance
 */
const portfolioValueBN = computed<BN>(() => {
    if (!isLoading.value) {
        return tokenTotalBalanceBN.value.plus(ethBalance.value)
    }
    return new BN(0)
})
/**
 * Returns formatted number for the total usd value of tokens + eth balance
 */
const portfolioValue = computed<string>(() => {
    return formatUsdValue(portfolioValueBN.value).value
})

/**------------------------
 * Chart
 -------------------------*/
interface Token {
    symbol: string
    percent: BN
    icon?: string
    usd: BN
}
/**
 * Returns top 4 tokens and percentage of the other tokens in the portfolio
 */
const topTokens = computed<Token[]>(() => {
    if (!isLoading.value) {
        //Add Eth Balance
        const ethPercent = ethBalance.value.multipliedBy(100).dividedBy(portfolioValueBN.value)
        let topFive: Token[] = [{ symbol: 'ETH', percent: ethPercent, icon: ethMarketInfo.value?.image, usd: ethBalance.value }]
        //Add Token Balance
        if (tokenSort.value && tokenTotalBalanceBN.value.gt(0)) {
            const topFiveTokens: Token[] | undefined = tokenSort.value.usdValue?.desend.slice(0, 5).map(i => {
                const _percent = new BN(i.usdValue).multipliedBy(100).dividedBy(portfolioValueBN.value)
                return {
                    symbol: i.symbol?.toUpperCase() || 'NA',
                    percent: _percent,
                    icon: i.image || undefined,
                    usd: i.usdValue
                }
            })
            if (topFiveTokens) {
                topFive.push(...topFiveTokens)
            }
            // Drop Zero Values:
            topFive = [...topFive.filter(i => i.usd.gt(0))]
            //Sort
            topFive.sort((x, y) => {
                const a = y.percent
                const b = x.percent
                return a.lt(b) ? -1 : a.gt(b) ? 1 : 0
            })
        }
        if (topFive.length > 5) {
            // Remove last 2 Items:
            topFive = [...topFive.slice(0, 4)]
            const totalOfFour = topFive.reduce((acc, el) => {
                return el.usd.plus(acc).toNumber()
            }, 0)
            const otherUSD = portfolioValueBN.value.minus(totalOfFour)
            const otherPercent = otherUSD.multipliedBy(100).dividedBy(portfolioValueBN.value)
            topFive.push({
                symbol: 'other',
                percent: otherPercent,
                usd: otherUSD
            })
        }

        return topFive
    }
    return []
})

const theme = useTheme()

const chartData = computed<ChartData<'doughnut'> | undefined>(() => {
    if (topTokens.value.length > 0) {
        return {
            labels: topTokens.value.map(i => i.symbol),
            datasets: [
                {
                    backgroundColor: [
                        theme.global.current.value.colors.success,
                        theme.global.current.value.colors.warning,
                        theme.global.current.value.colors.purple,
                        theme.global.current.value.colors.error,
                        theme.global.current.value.colors['on-surface']
                    ],
                    data: topTokens.value.map(i => i.usd.toNumber())
                }
            ]
        }
    }
    return undefined
})
</script>

<style scoped>
.token-percent {
    background-color: rgb(var(--v-theme-pillGrey));
    width: 70px;
}
</style>
