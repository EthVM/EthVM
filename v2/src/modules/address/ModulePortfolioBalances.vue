<template>
    <v-card fluid class="pa-4 pa-sm-6 fill-height" elevation="1" rounded="xl">
        <address-balance-totals title="ETH Balance" :is-loading="ethIsLoading" :balance="ethBalance">
            <template #extra>
                <v-col v-if="ethIsLoading" cols="6" sm="4" md="6" class="pa-0">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </v-col>
                <p v-else class="text-h5 font-weight-regular">{{ ethBalanceFiat }}</p>
            </template>
        </address-balance-totals>
        <v-divider class="my-6" />
        <address-balance-totals title="Token Balance" :is-loading="tokensIsLoading" :subtext="`${tokensCount} total tokens`" :balance="tokenBalanceFiat">
        </address-balance-totals>
    </v-card>
</template>

<script setup lang="ts">
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { computed } from 'vue'
import { useStore } from '@/store'
import { formatUsdValue, formatVariableUnitEthValue, formatNumber } from '@core/helper/number-format-helper'

const store = useStore()

const ethBalance = computed<string>(() => {
    return formatVariableUnitEthValue(store.portfolioWeiBalanceBN).value
})

const ethBalanceFiat = computed<string>(() => {
    return formatUsdValue(store.portfolioEthFiatBN).value
})

const tokenBalanceFiat = computed<string>(() => {
    return formatUsdValue(store.portfolioTokensFiatBN).value
})

const tokensCount = computed<string>(() => {
    return formatNumber(store.portfolioTokensRaw().length)
})

const ethIsLoading = computed<boolean>(() => {
    const total = store.portfolio.length
    const eth = Object.keys(store.portfolioEthBalanceMap)
    return total !== eth.length
})

const tokensIsLoading = computed<boolean>(() => {
    const total = store.portfolio.length
    const tokens = Object.keys(store.portfolioTokenBalanceMap)
    return total !== tokens.length
})
</script>

<style scoped></style>
