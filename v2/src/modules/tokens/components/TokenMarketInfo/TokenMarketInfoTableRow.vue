<template>
    <v-row align="center" justify="start" class="my-5">
        <v-col cols="6" sm="4" md="3">
            <v-row align="center" class="ma-0 flex-nowrap">
                <div class="mr-4">
                    <v-img :src="tokenImage" width="25px" height="25px" />
                </div>
                <div style="display: grid">
                    <router-link
                        v-if="props.token.symbol || props.token.name"
                        :to="`/token/${props.token.contract}`"
                        class="text-body-1 text-link text-ellipses"
                    >
                        <p class="text-textPrimary text-ellipses">{{ props.token.name }}</p>
                        <span v-if="props.token.symbol" class="text-info text-uppercase text-ellipses">{{ props.token.symbol }}</span>
                    </router-link>
                    <div v-else>
                        <p>Contract:</p>
                        <app-transform-hash :hash="eth.toCheckSum(props.token.contract)" :link="`/token/${props.token.contract}`" />
                    </div>
                </div>
            </v-row>
        </v-col>
        <v-col cols="3" sm="3" md="2">
            <v-row align="center" class="ma-0">
                <p class="mb-0">
                    {{ tokenPrice.value }}
                </p>
            </v-row>
        </v-col>
        <v-col cols="2" sm="3" md="2">
            <p :class="priceChangeClass">{{ percentageChange.value }}%</p>
        </v-col>
        <v-col md="2" class="d-none d-md-block">
            <v-row align="center" class="ma-0">
                <p class="mb-0">
                    {{ tokenVolume.value }}
                </p>
            </v-row>
        </v-col>
        <v-col md="2" class="d-none d-md-block">
            <v-row align="center" class="ma-0">
                <p class="mb-0">
                    {{ tokenMarketCap.value }}
                </p>
            </v-row>
        </v-col>
        <v-col cols="1" sm="2" md="1">
            <app-btn-icon :icon="favoriteTokens.has(props.token.contract) ? 'star' : 'star_outline'" @click="$emit('setFavorite', token.contract)" size="24" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { computed } from 'vue'
import { formatUsdValue, FormattedNumber, formatIntegerValue, formatPercentageValue } from '@core/helper/number-format-helper'
import { eth } from '@core/helper'
import BN from 'bignumber.js'

interface ComponentProps {
    token: TokenMarketData
    favoriteTokens: Set<string>
}

const props = defineProps<ComponentProps>()

const tokenImage = computed<string>(() => {
    return props.token.image || require('@/assets/icon-token.png')
})

const tokenPrice = computed<FormattedNumber>(() => {
    const price = props.token.current_price || 0
    return formatUsdValue(new BN(price))
})

const tokenVolume = computed<FormattedNumber>(() => {
    const volume = props.token.total_volume || 0
    return formatIntegerValue(new BN(volume))
})

const tokenMarketCap = computed<FormattedNumber>(() => {
    const marketCap = props.token.market_cap || 0
    return formatIntegerValue(new BN(marketCap))
})

const percentageChange = computed<FormattedNumber>(() => {
    const change = props.token.price_change_percentage_24h || 0
    return formatPercentageValue(new BN(change))
})

const priceChangeClass = computed<string>(() => {
    const change = props.token.price_change_percentage_24h || 0

    if (change > 0) {
        return 'text-success'
    }
    if (change < 0) {
        return 'text-error'
    }
    return 'text-textPrimary'
})
</script>

<style scoped></style>
