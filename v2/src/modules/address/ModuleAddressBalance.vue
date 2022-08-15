<template>
    <div>
        <v-card v-if="isOverview" fluid class="py-4 px-8 pa-md-6" elevation="1" rounded="xl">
            <address-balance title="ETH Balance" :is-loading="state.loadingBalanceData" :balance="`${balanceFormatted} ETH`">
                <template #extra>
                    <v-col v-if="loadingMarketInfo || state.loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
                        <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
                    </v-col>
                    <p v-else class="text-h4 font-weight-medium">{{ balanceFiatFormatted }}</p>
                </template>
            </address-balance>
            <div class="temp-chart pa-4 rounded-xl">
                <p>Chart Area</p>
            </div>
        </v-card>
        <div v-else fluid class="py-4 px-8 pa-md-6" elevation="1" rounded="xl">
            <v-row align="end" class="pt-11 mb-12">
                <app-token-icon :token-icon="ethTokenIcon" img-size="40px"></app-token-icon>
                <p class="text-h3 pl-2">Ethereum <span class="text-info text-body-1 pl-3">ETH</span></p>
            </v-row>
            <v-row dense>
                <v-col cols="3" lg="2">
                    <p class="text-info text-h6">Balance</p>
                    <v-progress-linear
                        v-if="state.loadingBalanceData"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h3">{{ balanceFormatted }}</p>
                </v-col>
                <v-col cols="3">
                    <p class="text-info text-h6">USD Value</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo || state.loadingBalanceData"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h3">{{ balanceFiatFormatted }}</p>
                </v-col>
                <v-col cols="3">
                    <p class="text-info text-h6">Price</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h3">
                        {{ priceFiatFormatted }} <span :class="['pl-5', percentageClass]"> {{ percentageFormatted }}%</span>
                    </p>
                </v-col>
                <v-col cols="12" class="mt-13">
                    <div class="temp-chart-balance pa-4 rounded-xl">
                        <p>Chart Area</p>
                    </div>
                </v-col>
            </v-row>
            <v-row dense class="mt-3">
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">Market Cap</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ marketCapFormatted }}</p>
                </v-col>
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">Circulating Supply</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ circSupplyFormatted }}</p>
                </v-col>
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">24h Trading Volume</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ volumeFormatted }}</p>
                </v-col>
            </v-row>
            <v-row dense class="mt-10">
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">Total Supply</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ supplyFormatted }}</p>
                </v-col>
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">24h High</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ high24hFormatted }}</p>
                </v-col>
                <v-col cols="6" md="4" lg="3">
                    <p class="text-info text-h6">24h Low</p>
                    <v-progress-linear
                        v-if="loadingMarketInfo"
                        height="28px"
                        rounded="xl"
                        indeterminate
                        color="#ECF2F7"
                        bg-color="info"
                        width="100px"
                    ></v-progress-linear>
                    <p v-else class="text-h4">{{ low24hFormatted }}</p>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGetEthBalanceQuery } from './apollo/addressBalance.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import BN from 'bignumber.js'
import { formatVariableUnitEthValue, formatUsdValue, formatPercentageValue } from '@/core/helper/number-format-helper'
import { eth } from '@/core/helper'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import AddressBalance from './components/AddressBalance.vue'
const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    }
})

interface ComponentState {
    loadingBalanceData: boolean
}

const state: ComponentState = reactive({
    loadingBalanceData: true
})
const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

const {
    result: balanceData,
    // onError,
    onResult
} = useGetEthBalanceQuery(
    () => ({
        hash: props.addressRef
    }),
    () => ({
        fetchPolicy: 'cache-and-network'
    })
)
/**
 * Once data is recieved sets loading to false
 */
onResult(({ data }) => {
    if (data && data.getEthBalance) {
        state.loadingBalanceData = false
        // emitErrorState(false)
    }
})
/**
 * ETH balance in WEI
 */
const balanceWei = computed<string>(() => {
    const balance = balanceData.value?.getEthBalance.balance
    return balance ? balance : '0'
})

/**
 * Returns formatted balance in ETH
 */
const balanceFormatted = computed<string>(() => {
    if (!state.loadingBalanceData) {
        return formatVariableUnitEthValue(new BN(balanceWei.value)).value
    }
    return ''
})
/**
 * Returns formatted ETH balance in FIAT
 */
const balanceFiatFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value && !state.loadingBalanceData) {
        console.log(ethMarketInfo.value)
        const ethPrice = ethMarketInfo?.value?.current_price || 0
        const balanceInEth = eth.toEthFromWei(balanceWei.value)
        const balanceInFiat = new BN(balanceInEth).multipliedBy(new BN(ethPrice))
        return formatUsdValue(balanceInFiat).value
    }
    return '$0.00'
})

/**
 * Returns formatted ETH price in FIAT
 */
const priceFiatFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const ethPrice = new BN(ethMarketInfo?.value?.current_price || 0)
        return formatUsdValue(ethPrice).value
    }
    return '$0.00'
})

/**
 * Returns formatted market cap in FIAT
 */
const marketCapFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const marketCap = new BN(ethMarketInfo?.value?.market_cap || 0)
        return formatUsdValue(marketCap).value
    }
    return '$0.00'
})

/**
 * Returns formatted circualting supply in FIAT
 */
const circSupplyFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const supply = new BN(ethMarketInfo?.value?.circulating_supply || 0)
        return formatUsdValue(supply).value
    }
    return '$0.00'
})

/**
 * Returns formatted circualting supply in FIAT
 */
const supplyFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const supply = new BN(ethMarketInfo?.value?.total_supply || 0)
        return formatUsdValue(supply).value
    }
    return '$0.00'
})
const percentageFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const percentage = new BN(ethMarketInfo?.value?.price_change_percentage_24h || 0)
        return formatPercentageValue(percentage).value
    }
    return '$0.00'
})
const percentageClass = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const percentage = new BN(ethMarketInfo?.value?.price_change_percentage_24h || 0)
        return percentage.isNegative() ? 'text-error' : 'text-success'
    }
    return ''
})
const low24hFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const low = new BN(ethMarketInfo?.value?.low_24h || 0)
        return formatUsdValue(low).value
    }
    return '$0.00'
})
const high24hFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const high = new BN(ethMarketInfo?.value?.high_24h || 0)
        return formatUsdValue(high).value
    }
    return '$0.00'
})

const volumeFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const volume = new BN(ethMarketInfo?.value?.total_volume || 0)
        return formatUsdValue(volume).value
    }
    return '$0.00'
})

/**
 * Returns formatted ETH balance in FIAT
 */
const ethTokenIcon = computed<string | undefined>(() => {
    if (!loadingMarketInfo.value && ethMarketInfo.value) {
        return ethMarketInfo.value.image
    }
    return undefined
})
</script>
<style lang="scss" scoped>
.temp-chart {
    height: 130px;
    background-color: #ecf2f7;
}

.temp-chart-balance {
    height: 276px;
    background-color: #ecf2f7;
}
</style>
