<template>
    <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
        <v-row align="center" :class="['fill-height', { 'flex-sm-nowrap': !props.addressRef }]" justify="space-between" class="mt-0">
            <v-col cols="12" :sm="props.addressRef ? '12' : 'auto'" align-self="start" class="py-0 pr-sm-0">
                <address-balance-totals
                    :title="$t('block.portfolioValue')"
                    :is-loading="isLoading"
                    :balance="portfolioValue.value"
                    :balanceTooltip="portfolioValue.tooltipText"
                >
                </address-balance-totals>
                <v-divider v-if="!props.addressRef && !xs" class="mt-10 mb-6" length="154"></v-divider>
                <address-balance-totals
                    v-if="!props.addressRef"
                    :title="`${currencyName} ${$t('common.balance')}`"
                    :is-loading="!store.portfolioEthIsLoaded()"
                    :balance="`${ethBalancePortfolio}`"
                    :balanceTooltip="ethBalanceTooltip"
                    class="mt-7"
                >
                    <template #extra>
                        <v-col v-if="!store.portfolioEthIsLoaded()" cols="6" sm="4" md="6" class="pa-0">
                            <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                        </v-col>
                        <p v-else class="text-h5 font-weight-regular">
                            {{ ethBalanceFiat.value }}
                            <span v-if="ethBalanceFiat.tooltipText"><app-tooltip :text="ethBalanceFiat.tooltipText"></app-tooltip></span>
                        </p>
                    </template>
                </address-balance-totals>
            </v-col>
            <v-col v-if="isLoading" cols="12" :sm="props.addressRef ? '12' : '7'" :md="props.addressRef ? '12' : '9'" :lg="props.addressRef ? '12' : '8'">
                <div class="skeleton-box rounded-xl pl-10" :style="props.addressRef ? 'min-height: 154px' : 'min-height: 180px'"></div>
            </v-col>
            <v-col v-if="!isLoading && portfolioValueBN.gt(0)" s cols="auto" class="mx-auto px-0">
                <chart-pie
                    :chart-data="chartData"
                    :loading="false"
                    :cutout="props.addressRef ? 42 : 56"
                    :style="props.addressRef ? 'height: 140px; width: 140px' : 'height: 170px; width: 170px'"
                    class="mx-auto mx-sm-0 my-3 my-sm-0"
                ></chart-pie>
            </v-col>
            <v-col
                v-if="!isLoading && portfolioValueBN.gt(0)"
                cols="12"
                :sm="props.addressRef ? 6 : 4"
                :md="props.addressRef ? 5 : 4"
                :lg="props.addressRef ? 7 : 4"
                align-self="center"
                class="pt-0 px-sm-0"
            >
                <v-row v-for="(i, index) in topTokens.slice(0, 4)" :key="i.symbol" justify="space-between" align="center" class="ma-0 flex-nowrap">
                    <div class="d-flex align-center py-1 pl-0">
                        <v-badge :color="colors[index]" dot inline left> </v-badge>
                        <app-token-icon :token-icon="i.icon" class="ml-2"></app-token-icon>
                    </div>
                    <p class="pl-3 text-button text-ellipses">{{ i.symbol }}</p>
                    <v-spacer />
                    <div class="token-percent rounded-xl px-2">
                        <p class="text-center text-info">{{ formatPercentageValue(i.percent).value }}%</p>
                    </div>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import AppTooltip from '@/core/components/AppTooltip.vue'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useAddressEthBalance } from '@core/composables/AddressEthBalance/addressEthBalance.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { computed, toRefs } from 'vue'
import { formatUsdValue, formatPercentageValue, formatNonVariableEthValue, FormattedNumberUnit, FormattedNumber } from '@/core/helper/number-format-helper'
import { useTheme } from 'vuetify/lib/framework.mjs'
import BN from 'bignumber.js'
import { ChartData } from 'chart.js'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { MarketDataFragment } from '@core/composables/CoinData/getLatestPrices.generated'
import ChartPie from '@module/chart/components/ChartPie.vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import { useStore } from '@/store'
import { TokenSort } from '@module/address/models/TokenSort'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { xs } = useDisplay()
const { currencyName } = useNetwork()
const store = useStore()

interface PropType {
    addressRef?: string
}
const props = withDefaults(defineProps<PropType>(), {
    addressRef: ''
})

const { addressRef } = toRefs(props)

const { initialLoad: loadingTokensBalances, tokenTotalBalanceBN, tokenSort } = useAddressToken(addressRef, 'cache-only')
const { initialLoad: loadingEthBalance, balanceFiatBN: ethBalance } = useAddressEthBalance(addressRef)

const { loading: loadingMarketInfo, ethMarketInfo, getEthereumTokensMap } = useCoinData()

/**------------------------
 * Prtfolio Value
 -------------------------*/
const isAddressView = computed<boolean>(() => {
    return addressRef.value !== ''
})

/**
 * Returns true when Token Balances, Eth Balance and Market data has been loaded,
 * false otherwise.
 */
const isLoading = computed<boolean>(() => {
    if (isAddressView.value) {
        return loadingTokensBalances.value || loadingEthBalance.value || loadingMarketInfo.value
    }
    return !store.portfolioIsLoaded
})

/**
 * Returns BigNumber for the total usd value of tokens + eth balance
 */
const portfolioValueBN = computed<BN>(() => {
    if (!isLoading.value) {
        if (isAddressView.value) {
            return tokenTotalBalanceBN.value.plus(ethBalance.value)
        }
        return store.portfolioTokensFiatBN.plus(store.portfolioEthFiatBN)
    }
    return new BN(0)
})
/**
 * Returns formatted number for the total usd value of tokens + eth balance
 */
const portfolioValue = computed<FormattedNumber>(() => {
    return formatUsdValue(portfolioValueBN.value)
})

/**
 * Returns formatted number for the total usd value of eth balance for the portfolio
 */
const ethBalancePortfolio = computed<string>(() => {
    const balance = formatNonVariableEthValue(store.portfolioWeiBalanceBN)
    const unit = balance.unit === FormattedNumberUnit.GWEI || balance.unit === FormattedNumberUnit.WEI ? balance.unit : currencyName.value
    return `${balance.value} ${unit}`
})

const ethBalanceTooltip = computed<string | undefined>(() => {
    const tooltip = formatNonVariableEthValue(store.portfolioWeiBalanceBN).tooltipText
    return tooltip ? `${tooltip} ${currencyName.value}` : undefined
})
const ethBalanceFiat = computed<FormattedNumber>(() => {
    return formatUsdValue(store.portfolioEthFiatBN)
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
//  */
const topTokens = computed<Token[]>(() => {
    if (!isLoading.value) {
        //Add Eth Balance
        let eth = new BN(0)
        let sortedTokens: TokenSort | false = false
        let tokenTotalBalance = new BN(0)
        if (isAddressView.value) {
            eth = ethBalance.value
            sortedTokens = tokenSort.value
            tokenTotalBalance = tokenTotalBalanceBN.value
        } else {
            eth = store.portfolioEthFiatBN
            tokenTotalBalance = store.portfolioTokensFiatBN
            //Token Sort:
            const contracts: string[] = []
            let tokenPrices: Map<string, MarketDataFragment> | false = false
            store.portfolioTokensRaw().forEach(token => {
                if (token) {
                    contracts.push(token.tokenInfo.contract)
                }
            })
            if (contracts.length > 0) {
                tokenPrices = getEthereumTokensMap(contracts)
            }
            sortedTokens = new TokenSort(store.portfolioTokensRaw(), tokenPrices, true)
        }
        const ethPercent = eth.multipliedBy(100).dividedBy(portfolioValueBN.value)

        let topFive: Token[] = [{ symbol: currencyName.value, percent: ethPercent, icon: ethMarketInfo.value?.image, usd: eth }]
        //Add Token Balance
        if (sortedTokens && tokenTotalBalance.gt(0)) {
            const topFiveTokens: Token[] | undefined = sortedTokens.usdValue?.desend.slice(0, 5).map(i => {
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

const colors = ['success', 'warning', 'purple', 'error']
</script>

<style scoped lang="scss">
.token-percent {
    background-color: rgb(var(--v-theme-pillGrey));
    width: 70px;
}
</style>
