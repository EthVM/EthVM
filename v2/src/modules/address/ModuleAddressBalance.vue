<template>
    <v-card fluid class="py-4 px-8 pa-md-6" elevation="1" rounded="xl">
        <p class="text-info text-h6 font-weight-regular">ETH Balance</p>
        <v-col v-if="state.loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
            <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        </v-col>
        <p v-else class="text-h4">{{ balanceFormatted }} ETH</p>
        <v-col v-if="loadingMarketInfo || state.loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
            <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        </v-col>
        <p v-else class="text-h4 font-weight-regular">{{ balanceFiatFormatted }}</p>
        <div class="temp-chart pa-4 rounded-xl">
            <p>Chart Area</p>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGetEthBalanceQuery } from './apollo/addressBalance.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import BN from 'bignumber.js'
import { formatVariableUnitEthValue, formatUsdValue } from '@/core/helper/number-format-helper'
import { eth } from '@/core/helper'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
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
        const ethPrice = ethMarketInfo?.value?.current_price || 0
        const balanceInEth = eth.toEthFromWei(balanceWei.value)
        const balanceInFiat = new BN(balanceInEth).multipliedBy(new BN(ethPrice))
        return formatUsdValue(balanceInFiat).value
    }
    return '$0.00'
})
</script>
<style lang="scss" scoped>
.temp-chart {
    height: 130px;
    background-color: #ecf2f7;
}
</style>
