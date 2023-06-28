<template>
    <div>
        <div class="d-flex align-start mb-5">
            <div class="mr-3">
                <app-token-icon :token-icon="image" img-size="40px"></app-token-icon>
            </div>
            <div>
                <p class="text-h4 font-weight-bold">{{ tokenName }}</p>
                <p class="mt-1">{{ tokenSymbol.toUpperCase() }}</p>
            </div>
        </div>
        <v-row>
            <v-col cols="12" lg="8">
                <v-row>
                    <v-col cols="12" sm="4" md="3">
                        <p class="text-info">{{ $t('common.price') }}</p>
                        <div v-if="!loadingTokenData" class="d-flex align-center mb-2">
                            <p class="text-subtitle-1 font-weight-bold">{{ price }}</p>
                            <span v-if="priceChange" class="d-sm-flex align-center ml-3" :class="`text-${priceChange.color}`">
                                <span> {{ priceChange.change }}% </span>
                                <v-icon v-if="priceChange.icon" size="14">{{ priceChange.icon }}</v-icon>
                            </span>
                        </div>
                    </v-col>
                    <v-col v-for="detail in otherDeatils" cols="6" sm="4" md="3" :key="detail.title">
                        <p class="text-info">{{ detail.title }}</p>
                        <p class="text-subtitle-1 font-weight-bold mb-2">{{ detail.text }}</p>
                    </v-col>
                    <!-- <v-col cols="12">
                        <p class="mb-5">
                            Binance Coin (BNB) is an exchange-based token created and issued by the cryptocurrency exchange Binance. Initially created on the
                            Ethereum blockchain as an ERC-20 token in July 2017, BNB was migrated over to Binance Chain in February 2019 and became the native
                            coin of the Binance Chain.
                        </p>
                    </v-col> -->
                </v-row>
            </v-col>
            <v-spacer class="d-none d-lg-flex"></v-spacer>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import BN from 'bignumber.js'
import { formatPercentageValue, formatUsdValue } from '@core/helper/number-format-helper'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TokenDetailsFragment as TokenInfo } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { computed } from 'vue'
import { MarketDataFragment as TokenMarketData } from '@/core/composables/CoinData/getLatestPrices.generated'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
interface PropType {
    addressRef: string
    isLoading: boolean
    tokenDetails: TokenInfo
}

const props = defineProps<PropType>()

interface ComponentState {
    isRopsten: boolean
    hasError: boolean
    imageExists: boolean
}

const state: ComponentState = {
    isRopsten: false,
    hasError: false,
    imageExists: true
}

const emit = defineEmits(['errorDetails'])

/*
===================================================================================
  Methods:
===================================================================================
*/
/**
 * Emit error to Sentry
 * @param val {Boolean}
 */
const emitErrorState = (val: boolean): void => {
    state.hasError = val
    emit('errorDetails', val, ErrorMessageToken.details)
}

/*
===================================================================================
  Computed Values
===================================================================================
*/
const { getEthereumTokenByContract, loading: loadingCoinData } = useCoinData()
const tokenData = computed<TokenMarketData | false>(() => {
    if (props.addressRef) {
        try {
            emitErrorState(false)
            return getEthereumTokenByContract(props.addressRef)
        } catch (error) {
            emitErrorState(true)
        }
    }
    return false
})

const tokenName = computed<string>(() => {
    return props.tokenDetails?.name || ''
})

const tokenSymbol = computed<string>(() => {
    return props.tokenDetails?.symbol?.toUpperCase() || ''
})

const image = computed<string>(() => {
    return !(tokenData.value && tokenData.value.image && state.imageExists) ? require('@/assets/icon-token.png') : tokenData.value.image
})

const loadingTokenData = computed<boolean>(() => {
    return loadingCoinData.value || props.isLoading
})

/**
 * Token Price
 */
const price = computed<string>(() => {
    const price = !props.isLoading && tokenData.value && tokenData.value.current_price ? tokenData.value.current_price : 0
    return formatUsdValue(new BN(price)).value
})

/**
 * Price Change
 */
interface PriceChange {
    icon: string
    color: string
    change: string
}

const priceChange = computed<PriceChange | null>(() => {
    const change = !props.isLoading && tokenData.value && tokenData.value.price_change_percentage_24h ? tokenData.value.price_change_percentage_24h : 0
    const formatted = formatPercentageValue(new BN(change).absoluteValue()).value
    if (change > 0) {
        return {
            change: formatted,
            icon: 'arrow_upward',
            color: 'success'
        }
    }
    if (change < 0) {
        return {
            change: formatted,
            icon: 'arrow_downward',
            color: 'error'
        }
    }
    return null
})

/**
 * Other Details:
 * Market Cap, 24h Low, 24h High, Circulating Supply, Max Supply, Trading Volume
 */

interface TokenDetail {
    title: string
    text: string
}

const otherDeatils = computed<TokenDetail[]>(() => {
    const zero = '$0.00'
    return [
        {
            title: t('market.marketCap'),
            text: !props.isLoading && tokenData.value && tokenData.value.market_cap ? formatUsdValue(new BN(tokenData.value.market_cap)).value : zero
        },
        {
            title: t('market.24hHigh'),
            text: !props.isLoading && tokenData.value && tokenData.value.high_24h ? formatUsdValue(new BN(tokenData.value.high_24h)).value : zero
        },
        {
            title: t('market.24hLow'),
            text: !props.isLoading && tokenData.value && tokenData.value.low_24h ? formatUsdValue(new BN(tokenData.value.low_24h)).value : zero
        },
        {
            title: t('market.circulatingSupply'),
            text:
                !props.isLoading && tokenData.value && tokenData.value.circulating_supply
                    ? formatUsdValue(new BN(tokenData.value.circulating_supply)).value
                    : zero
        },
        {
            title: t('market.maxSupply'),
            text: !props.isLoading && tokenData.value && tokenData.value.total_supply ? formatUsdValue(new BN(tokenData.value.total_supply)).value : zero
        },
        {
            title: t('market.24hTradingVolume'),
            text: !props.isLoading && tokenData.value && tokenData.value.total_volume ? formatUsdValue(new BN(tokenData.value.total_volume)).value : zero
        }
    ]
})
</script>
