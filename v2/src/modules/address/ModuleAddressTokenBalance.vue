<template>
    <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
        <address-balance-totals
            title="Token Balance"
            :is-loading="initialLoad || loadingMarketInfo"
            :balance="tokenBalanceValue"
            :subtext="`${tokenCount} total tokens`"
        >
        </address-balance-totals>
        <v-divider class="my-6" />
        <address-balance-totals title="Total NFT's" :is-loading="initialLoad || loadingMarketInfo" balance="200"> </address-balance-totals>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { computed } from 'vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { initialLoad, tokenBalanceValue, tokenCount } = useAddressToken(props.addressRef)
const { loading: loadingMarketInfo } = useCoinData()
</script>

<style scoped></style>
