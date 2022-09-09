<template>
    <div class="position-relative">
        <v-row align="center" justify="start" class="mt-5" :class="!state.showMoreDetails ? 'mb-5' : 'mb-1'" @click="toggleMoreDetails">
            <v-col cols="6" sm="4" md="2" lg="3">
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
                <p class="mb-0">
                    {{ tokenPrice.value }}
                </p>
            </v-col>
            <v-col cols="2" sm="3" md="2">
                <p :class="priceChangeClass">{{ percentageChange.value }}%</p>
            </v-col>
            <v-col md="2" class="d-none d-md-block">
                <p class="mb-0">
                    {{ tokenVolume.value }}
                </p>
            </v-col>
            <v-col md="2" class="d-none d-md-block">
                <p class="mb-0">
                    {{ tokenMarketCap.value }}
                </p>
            </v-col>
            <v-col cols="1" sm="2" md="2" lg="1">
                <app-btn-icon
                    :icon="favoriteTokens.has(props.token.contract) ? 'star' : 'star_outline'"
                    @click="$emit('setFavorite', token.contract)"
                    size="24"
                />
            </v-col>
        </v-row>
        <div v-if="state.showMoreDetails" class="pb-5 text-subtitle-2 font-weight-regular">
            <v-row>
                <v-col>
                    <div>
                        <p class="text-info">Volume</p>
                        <p class="mb-0">
                            {{ tokenVolume.value }}
                        </p>
                    </div>
                </v-col>
                <v-col>
                    <div>
                        <p class="text-info">Market Cap</p>
                        <p class="mb-0">
                            {{ tokenMarketCap.value }}
                        </p>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div v-if="state.showMoreDetails" class="row-bg bg-tableGrey"></div>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { computed, reactive, ref } from 'vue'
import { formatUsdValue, FormattedNumber, formatIntegerValue, formatPercentageValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { eth } from '@core/helper'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

interface ComponentProps {
    token: TokenMarketData
    favoriteTokens: Set<string>
}

const props = defineProps<ComponentProps>()

const emit = defineEmits<{
    (e: 'setFavorite', contract: string): void
}>()

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

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

const toggleMoreDetails = (): void => {
    // Only toggle details if on mobile view
    if (smAndDown.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
</script>

<style scoped></style>
