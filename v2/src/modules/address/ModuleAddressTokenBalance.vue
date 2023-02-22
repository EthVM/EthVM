<template>
    <v-card fluid class="pa-4 pa-sm-6 fill-height" elevation="1" rounded="xl">
        <div class="d-flex flex-nowrap align-center">
            <address-balance-totals
                title="Token Balance"
                :is-loading="initialLoad || loadingMarketInfo"
                :balance="tokenBalanceValue"
                :subtext="`${tokenCount} total tokens`"
            >
            </address-balance-totals>
            <app-token-icon-row v-if="!loadingMarketInfo && !initialLoad" :tokens="tokenIcons"></app-token-icon-row>
        </div>
        <v-divider class="my-6" />
        <address-balance-totals title="Total NFT's" :is-loading="initialLoad || loadingMarketInfo" balance="200"> </address-balance-totals>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import AppTokenIconRow from '@/core/components/AppTokenIconRow.vue'
import { toRefs, computed } from 'vue'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { addressRef } = toRefs(props)

const { initialLoad, tokenBalanceValue, tokenCount, tokenSort } = useAddressToken(addressRef, 'cache-only')
const { loading: loadingMarketInfo } = useCoinData()

const tokenIcons = computed<string[]>(() => {
    if (tokenSort.value) {
        return tokenSort.value
            ?.getSortedTokens(TOKEN_FILTER_VALUES[5])
            .slice(0, 10)
            .map(i => {
                console.log(i.image)
                return i.image
            })
            .reverse()
            .filter(i => i !== '')
    }
    return []
})
</script>

<style scoped></style>
