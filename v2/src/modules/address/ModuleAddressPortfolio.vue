<template>
    <v-card fluid class="py-4 px-8 pa-md-6 h-100" elevation="1" rounded="xl">
        <address-balance-totals title="Portfolio Value" :is-loading="isLoading" :balance="portfolioValue"> </address-balance-totals>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useAddressEthBalance } from '@core/composables/AddressEthBalance/addressEthBalance.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { computed } from 'vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { formatUsdValue } from '@/core/helper/number-format-helper'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { initialLoad: loadingTokensBalances, tokenTotalBalanceBN } = useAddressToken(props.addressRef)
const { initialLoad: loadingEthBalance, balanceFiatBN: ethBalance } = useAddressEthBalance(props.addressRef)
const { loading: loadingMarketInfo } = useCoinData()

const isLoading = computed<boolean>(() => {
    return loadingTokensBalances.value || loadingEthBalance.value || loadingMarketInfo.value
})

const portfolioValue = computed<string>(() => {
    if (!isLoading.value) {
        const total = tokenTotalBalanceBN.value.plus(ethBalance.value)
        return formatUsdValue(total).value
    }
    return '$0.00'
})
</script>

<style scoped></style>
