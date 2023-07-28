<template>
    <v-card fluid class="pa-4 pa-sm-6 fill-height" elevation="1" rounded="xl">
        <div class="d-flex flex-nowrap align-center">
            <address-balance-totals
                :title="$t('block.tokenBalance')"
                :is-loading="initialLoad || loadingMarketInfo"
                :balance="tokenBalance.value"
                :balance-tooltip="tokenBalance.tooltipText"
                :subtext="tokenCountSubtext"
            >
            </address-balance-totals>
            <app-token-icon-row v-if="!loadingMarketInfo && !initialLoad" :tokens="tokenIcons"></app-token-icon-row>
        </div>
        <v-divider class="my-6" />
        <address-balance-totals :title="$t('block.nftTotal')" :is-loading="loadingNftCount" :balance="nftCount"> </address-balance-totals>
    </v-card>
</template>

<script setup lang="ts">
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import AppTokenIconRow from '@/core/components/AppTokenIconRow.vue'
import { toRefs, computed } from 'vue'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { useGetOwnersNftBalanceQuery } from '@module/address/apollo/AddressTokens/tokens.generated'
import { formatIntegerValue } from '@core/helper/number-format-helper'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const { addressRef } = toRefs(props)

const { initialLoad, tokenBalance, tokenCount, tokenSort } = useAddressToken(addressRef, 'cache-only')
const { loading: loadingMarketInfo } = useCoinData()

const { result: nftCountRes, loading: loadingNftCount } = useGetOwnersNftBalanceQuery(() => ({
    address: props.addressRef
}))

const nftCount = computed<string>(() => {
    if (!loadingNftCount.value && nftCountRes.value) {
        return formatIntegerValue(new BigNumber(nftCountRes.value?.getOwnersNFTBalance.balance)).value
    }
    return '0'
})
const tokenIcons = computed<string[]>(() => {
    if (tokenSort.value) {
        return tokenSort.value
            ?.getSortedTokens(TOKEN_FILTER_VALUES[5])
            .slice(0, 10)
            .map(i => {
                return i.image
            })
            .reverse()
            .filter(i => i !== '')
    }
    return []
})

const tokenCountSubtext = computed<string>(() => {
    return tokenCount.value === 1 ? t('token.tokenTotal') : t('token.tokenTotal', { n: tokenCount.value })
})
</script>

<style scoped></style>
