<template>
    <v-card fluid class="py-4 px-8 pa-md-6 h-100" elevation="1" rounded="xl">
        <p class="text-info text-h6 font-weight-regular">Token Balance</p>
        <v-col v-if="initialLoad || loadingMarketInfo" cols="6" sm="4" md="6" class="pa-0">
            <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        </v-col>
        <template v-else>
            <p class="text-h4">${{ tokenBalanceValue }}</p>
            <p class="text-caption font-weight-regular text-info">{{ tokenCount }} total tokens</p>
            <v-divider class="my-6" />
            <p class="text-info text-h6 font-weight-regular">Total NFT's</p>
            <p class="text-h4">200</p>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { computed } from 'vue'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { initialLoad, tokenBalance, erc20Tokens } = useAddressToken(props.addressRef)
const { loading: loadingMarketInfo } = useCoinData()

const tokenCount = computed<number>(() => {
    return erc20Tokens.value.length || 0
})

const tokenBalanceValue = computed<string>(() => {
    return tokenBalance.value.value || '0'
})
</script>

<style scoped></style>
