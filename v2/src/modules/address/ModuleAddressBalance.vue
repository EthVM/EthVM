<template>
    <div>
        <v-card v-if="isOverview" fluid class="py-4 px-8 pa-md-6" elevation="1" rounded="xl">
            <p class="text-info text-h6">ETH Balance</p>
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
        <div v-else fluid class="py-4 px-8 pa-md-6" elevation="1" rounded="xl">
            <v-row align="end" class="pt-11 mb-12">
                <app-token-icon :token-icon="ethTokenIcon" img-size="40px"></app-token-icon>
                <p class="text-h3">Ethereum <span class="text-info text-body-1 pl-3">ETH</span></p>
            </v-row>
            <v-row>
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
                <v-col cols="3" lg="2">
                    <p class="text-info text-h6">Balance</p>
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
                    <p v-else class="text-h3">{{ priceFiatFormatted }} <span class="pl-5 text-error"> -2.3%</span></p>
                </v-col>
            </v-row>

            <!-- <v-col v-if="state.loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
                <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
            </v-col>
            <p v-else class="text-h4">{{ balanceFormatted }} ETH</p>
            <v-col v-if="loadingMarketInfo || state.loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
                <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
            </v-col>
            <p v-else class="text-h4 font-weight-regular">{{ balanceFiatFormatted }}</p>
             -->
            <!-- <div class="temp-chart pa-4 rounded-xl">
            <p>Chart Area</p>
        </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGetEthBalanceQuery } from './apollo/addressBalance.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import BN from 'bignumber.js'
import { formatVariableUnitEthValue, formatUsdValue } from '@/core/helper/number-format-helper'
import { eth } from '@/core/helper'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
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
</style>
