<template>
    <app-table-row row-align="start" row-align-lg="center" :color="state.showMore ? 'lightGrey' : 'transparent'" v-on="{ click: openMoreInfo }">
        <!--
                Token on Overview:
                XS: NONE
                SM and UP: 4
                ------------
                Token:
                XS: NONE
                SM : 4F
                LG: 2
             -->
        <v-col cols="6" sm="4" :lg="props.isOverview ? 4 : 3" :class="['d-flex align-center']">
            <app-token-icon :token-icon="token.image || undefined" img-size="32px" />
            <p class="text-truncate ml-4">
                {{ token.name }}
                <span class="text-info text-uppercase text-truncate d-block pt-1">{{ token.symbol }}</span>
            </p>
        </v-col>
        <!--
            Symbol on Overview:
            XS and UP: NONE
            ------------
            Symbol
            XS: NONE
            LG: 1
         -->
        <!-- <v-col v-if="!props.isOverview" cols="1" class="d-none d-lg-block">
            <p class="text-uppercase text-truncate text-info">{{ token.symbol }}</p>
        </v-col> -->
        <!--
            OTHER on Overview:
            XS: NONE
            SM: 8
            ------------
            OTHER
            XS: NONE
            SM: 8
            LG: 9
         -->
        <v-col cols="6" sm="8" :lg="props.isOverview ? 8 : 9">
            <v-row :dense="xs" class="align-start align-lg-center">
                <!-- Price-->
                <v-col cols="4" :lg="props.isOverview ? 4 : 3" class="pb-0 d-none d-sm-block">
                    <p v-if="token.current_price">
                        {{ formatUsdValue(new BN(token.current_price)).value }}
                    </p>
                    <p :class="[priceChangeClass, 'd-lg-none mt-1']">
                        {{ token.getPriceChangeFormatted() }}
                    </p>
                </v-col>
                <!-- Price Change-->
                <v-col v-if="!props.isOverview" lg="3" class="d-none d-lg-block">
                    <p :class="priceChangeClass">{{ token.getPriceChangeFormatted() }}</p>
                </v-col>
                <!--
                        USD Value -->
                <v-col cols="12" sm="4" :lg="props.isOverview ? 4 : 3" class="pb-0 d-none d-sm-block">
                    <p class="text-right text-sm-left">{{ token.getUSDValueFormatted() }}</p>
                </v-col>
                <!-- Balance -->
                <v-col cols="12" sm="4" :lg="props.isOverview ? 4 : 3" class="pb-0 d-block d-sm-flex justify-sm-space-between align-start align-lg-center">
                    <p class="text-right text-sm-left">{{ token.getBalanceFormatted() }}</p>
                    <p class="d-sm-none text-right text-sm-left text-info mt-1">
                        {{ token.getUSDValueFormatted() }}
                    </p>
                    <div v-if="!props.isOverview && marketData" class="mt-n2 mt-lg-0">
                        <app-btn-icon
                            :icon="state.showMore ? 'expand_less' : 'expand_more'"
                            size="small"
                            @click="openMoreInfo()"
                            class="d-none d-sm-block"
                        ></app-btn-icon>
                    </div>
                </v-col>
            </v-row>
        </v-col>
        <template #expandable>
            <v-col v-if="state.showMore && marketData" cols="12">
                <v-row :dense="xs">
                    <v-col cols="12" md="4" lg="5"></v-col>
                    <v-col cols="12" md="8" lg="7" class="pa-3 pt-md-10 pb-md-5 pl-lg-9">
                        <v-row :dense="xs">
                            <v-col cols="6" class="d-sm-none">
                                <p class="mb-1 text-info font-weight-bold">{{ $t('common.price') }}</p>
                                <p class="mb-4">
                                    {{ formatUsdValue(new BN(token.current_price || 0)).value }}
                                </p></v-col
                            >
                            <v-col cols="6" class="d-sm-none">
                                <p class="mb-1 text-info font-weight-bold">{{ $t('market.priceChange') }}</p>
                                <p :class="[priceChangeClass, 'mb-4']">
                                    {{ token.getPriceChangeFormatted() }}
                                </p>
                            </v-col>
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.marketCap') }}</p>
                                <p class="mb-4 mb-md-9">{{ marketData.market_cap }}</p></v-col
                            >
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.circulatingSupply') }}</p>
                                <p class="mb-4 mb-md-9">{{ marketData.circ_supply }}</p></v-col
                            >
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.24hTradingVolume') }}</p>
                                <p class="mb-4 mb-md-9">{{ marketData.volume }}</p></v-col
                            >
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.maxSupply') }}</p>
                                <p class="mb-4 mb-md-9">{{ marketData.total_supply }}</p></v-col
                            >
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.24hHigh') }}</p>
                                <p class="mb-0 mb-md-9">{{ marketData.high }}</p></v-col
                            >
                            <v-col cols="6" md="4">
                                <p class="mb-1 mb-md-3 text-info font-weight-bold">{{ $t('market.24hLow') }}</p>
                                <p class="mb-0 mb-md-9">{{ marketData.low }}</p></v-col
                            >
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </app-table-row>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import { Token } from '../models/TokenSort'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatUsdValue } from '@/core/helper/number-format-helper'
import BN from 'bignumber.js'

const { xs } = useDisplay()
const { getEthereumTokenByContract } = useCoinData()

const props = defineProps({
    token: {
        type: Token,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true
    }
})

const state = reactive({
    showMore: false
})

const change = (token: Token): number => {
    if (!token.price_change_percentage_24h || token.price_change_percentage_24h === 0) {
        return 0
    } else if (token.price_change_percentage_24h > 0) {
        return 1
    }
    return -1
}

const priceChangeClass = computed<string>(() => {
    if (change(props.token) === 0) {
        return 'text-black'
    } else if (change(props.token) > 0) {
        return 'text-success'
    }
    return 'text-error'
})

const marketData = computed(() => {
    const market = getEthereumTokenByContract(props.token.contract)
    if (market) {
        return {
            market_cap: formatUsdValue(new BN(market.market_cap || 0)).value,
            circ_supply: formatUsdValue(new BN(market.circulating_supply || 0)).value,
            total_supply: formatUsdValue(new BN(market.total_supply || 0)).value,
            volume: formatUsdValue(new BN(market.total_volume || 0)).value,
            low: formatUsdValue(new BN(market.low_24h || 0)).value,
            high: formatUsdValue(new BN(market.high_24h || 0)).value
        }
    }
    return null
})

const emit = defineEmits<{
    (e: 'setActiveToken', id: string): void
}>()

const openMoreInfo = () => {
    if (!props.isOverview && marketData.value !== null) {
        state.showMore = !state.showMore
    } else {
        emit('setActiveToken', props.token.contract)
    }
}

onMounted(() => {
    if (props.isActive) {
        state.showMore = true
    }
})
</script>
