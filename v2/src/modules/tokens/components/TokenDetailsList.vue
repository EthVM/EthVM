<template>
    <v-row row wrap justify="start" class="mb-4">
        <v-col xs="12" md="6">
            <v-card elevation="1" rounded="xl" variant="flat" class="pa-4 pa-sm-6 h-100">
                <div class="mb-6">
                    <v-row align="center">
                        <div class="mr-3">
                            <v-img :src="image" contain width="30" height="30" />
                        </div>
                        <div>
                            <p class="text-h4">{{ tokenName }}</p>
                            <p class="text-body-1">{{ tokenSymbol.toUpperCase() }}</p>
                        </div>
                    </v-row>
                    <div class="skeleton-box rounded-xl my-6 d-md-none" style="height: 200px"></div>
                </div>
                <div class="mb-5 mb-md-4 d-flex d-md-block justify-space-between">
                    <div>
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ priceDetail.title }}</p>
                        <div v-if="!loadingTokenData" class="d-flex align-center">
                            <p class="text-subtitle-1 text-md-h4 mt-1 mr-md-3">{{ priceDetail.detail }}</p>
                            <span
                                v-if="priceDetail.priceChange && priceDetail.priceChange"
                                class="d-none d-md-flex align-center text-subtitle-1 mt-1"
                                :class="`text-${priceChange.color}`"
                            >
                                <span> {{ priceDetail.priceChange.value }} {{ priceDetail.priceChange.unit }} </span>
                                <v-icon v-if="priceChange.icon" size="14">{{ priceChange.icon }}</v-icon>
                            </span>
                        </div>
                        <div v-else class="skeleton-box rounded-xl mt-2" style="height: 20px; width: 200px"></div>
                    </div>
                    <div class="d-md-none v-col-6 py-0">
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ priceChange.title }}</p>
                        <p v-if="!props.isLoading && priceDetail.priceChange" class="text-subtitle-1 text-md-h4 mt-1" :class="`text-${priceChange.color}`">
                            {{ priceDetail.priceChange.value }} {{ priceDetail.priceChange.unit }}
                        </p>
                        <div v-else class="skeleton-box rounded-xl mt-2" style="height: 20px"></div>
                    </div>
                </div>
                <v-row class="mb-5 mb-md-4">
                    <v-col cols="6">
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ marketCapDetail.title }}</p>
                        <p v-if="!loadingTokenData" class="text-subtitle-1 text-md-h4 mt-1">{{ marketCapDetail.detail }}</p>
                        <div v-else class="skeleton-box rounded-xl mt-2" style="height: 20px"></div>
                    </v-col>
                    <v-col cols="6">
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ circulatingSupplyDetail.title }}</p>
                        <p v-if="!loadingTokenData" class="text-subtitle-1 text-md-h4 mt-1">{{ circulatingSupplyDetail.detail }}</p>
                        <div v-else class="skeleton-box rounded-xl mt-2" style="height: 20px"></div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ volumeDetail.title }}</p>
                        <p v-if="!loadingTokenData" class="text-subtitle-1 text-md-h4 mt-1">{{ volumeDetail.detail }}</p>
                        <div v-else class="skeleton-box rounded-xl mt-2" style="height: 20px"></div>
                    </v-col>
                    <v-col cols="6">
                        <p class="text-info text-subtitle-2 font-weight-regular text-md-body-1">{{ supplyDetail.title }}</p>
                        <p v-if="!loadingTokenData" class="text-subtitle-1 text-md-h4 mt-1">{{ supplyDetail.detail }}</p>
                        <div v-else class="skeleton-box rounded-xl my-2" style="height: 20px"></div>
                    </v-col>
                </v-row>
                <div class="d-md-none">
                    <token-details-socials :token-details="tokenDetails" :is-nft="props.isNft" class="my-5" />
                    <token-details-history :token-history="tokenHistory" class="my-5" />
                </div>
            </v-card>
        </v-col>
        <v-col md="6" class="d-none d-md-block">
            <v-card elevation="1" rounded="xl" variant="flat" class="pa-4 pa-sm-6 h-100">
                <token-details-socials :token-details="tokenDetails" :is-loading="props.isLoading" :is-nft="props.isNft" />
            </v-card>
        </v-col>
        <v-col cols="12" class="d-none d-md-block">
            <v-card elevation="1" rounded="xl" variant="flat" class="pa-4 pa-sm-6 h-100">
                <v-card-title>Price History</v-card-title>
                <div class="skeleton-box rounded-xl mt-1" style="height: 200px"></div>
            </v-card>
        </v-col>
        <v-col cols="7" class="d-none d-md-block">
            <v-card elevation="1" rounded="xl" variant="flat" class="pa-4 pa-sm-6 h-100">
                <token-details-history :token-history="tokenHistory" />
            </v-card>
        </v-col>
        <v-col cols="5" class="d-none d-md-block">
            <v-card elevation="1" rounded="xl" variant="flat" class="pa-4 pa-sm-6 h-100">
                <div class="skeleton-box rounded-xl mt-1" style="height: 200px"></div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { Detail } from '@core/components/props'
import AppDetailsList from '@core/components/AppDetailsList.vue'
import TokenDetailsSocials from '@module/tokens/components/TokenDetailsSocials.vue'
import { Hex } from '@core/models'
import BN from 'bignumber.js'
import { formatFloatingPointValue, formatNumber, formatPercentageValue, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import {
    GetErc20TokenBalanceQuery as TokenOwnerInfo,
    GetTokenInfoByContractQuery as TokenInfo
} from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { computed } from 'vue'
import { MarketDataFragment as TokenMarketData } from '@/core/composables/CoinData/getLatestPrices.generated'
import TokenDetailsHistory from '@module/tokens/components/TokenDetailsHistory.vue'

interface PropType {
    addressRef: string
    isLoading: boolean
    isNft: boolean
    tokenDetails: TokenInfo
    holderDetails: TokenOwnerInfo
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

/**
 * Image loading failed catcher
 */
const imgLoadFail = (): void => {
    state.imageExists = false
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

/**
 * Create properly-formatted title from tokenDetails
 *
 * @return {String} - Title for details list
 */
const title = computed<string>(() => {
    let name = 'Token'
    let symbol = ''
    let holder = ''
    if (props.tokenDetails && !props.isLoading) {
        name = props.tokenDetails.name === null ? name : props.tokenDetails.name
        symbol = props.tokenDetails.symbol === null || !props.tokenDetails.symbol ? symbol : `(${props.tokenDetails.symbol.toUpperCase()}) `
    }
    if (props.holderDetails && props.holderDetails.owner) {
        holder = `- Filtered by Holder`
    }
    return `${name} ${symbol} ${holder}`
})

const tokenName = computed<string>(() => {
    return props.tokenDetails?.name || ''
})

const tokenSymbol = computed<string>(() => {
    return props.tokenDetails?.symbol.toUpperCase() || ''
})

const image = computed<string>(() => {
    return !(tokenData.value && tokenData.value.image && state.imageExists) ? require('@/assets/icon-token.png') : tokenData.value.image
})

const loadingTokenData = computed<boolean>(() => {
    return loadingCoinData.value || props.isLoading
})

/**
 * Properly format the Details[] array for the details table.
 * If the data hasn't been loaded yet, then only include the titles in the details.
 */
const details = computed<Detail[]>(() => {
    return props.holderDetails ? holderDetailsList.value : tokenDetailsList.value
})

/**
 * Get details list for token detail view
 */
const tokenDetailsList = computed<Detail[]>(() => {
    const details = [contractDetail.value]
    contractDecimalsDetail.value.detail ? details.push(contractDecimalsDetail.value) : null
    if (props.holderDetails && props.holderDetails.owner && contractOwnerDetail.value.detail) {
        details.push(contractOwnerDetail.value)
    }
    if (!props.isRopsten && priceDetail.value.detail) {
        details.push(priceDetail.value)
    }
    supplyDetail.value.detail ? details.push(supplyDetail.value) : null
    if (!state.isRopsten) {
        marketCapDetail.value.detail ? details.push(marketCapDetail.value) : null
        volumeDetail.value.detail ? details.push(volumeDetail.value) : null
    }
    return details
})

/**
 * Get details list for holder detail view
 */
const holderDetailsList = computed<Detail[]>(() => {
    const details = [holderDetail.value, holderBalanceDetail.value]
    if (!state.isRopsten && holderUsdDetail.value.detail) {
        details.push(holderUsdDetail.value)
    }
    // details.push(holderTransfersDetail.value)
    return details.concat(tokenDetailsList.value)
})

const contractDetail = computed<Detail>(() => {
    const detail: Detail = { title: 'Contract' }
    if (!props.isLoading && props.tokenDetails) {
        detail.detail = new Hex(props.tokenDetails.contract).toString()
        detail.link = `/address/${new Hex(props.tokenDetails.contract).toString()}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const contractOwnerDetail = computed<Detail>(() => {
    const detail: Detail = { title: 'Owner' }
    if (!props.isLoading && props.holderDetails && props.holderDetails.owner) {
        detail.detail = props.holderDetails.owner
        detail.link = `/address/${props.holderDetails.owner}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const contractDecimalsDetail = computed<Detail>(() => {
    return {
        title: 'Decimals',
        detail: !props.isLoading && props.tokenDetails && props.tokenDetails.decimals != null ? props.tokenDetails.decimals : undefined
    }
})

const priceDetail = computed<Detail>(() => {
    const detail: Detail = { title: 'Price' }
    if (!props.isLoading && tokenData.value) {
        const priceFormatted = formatUsdValue(new BN(tokenData.value.current_price || 0))
        detail.detail = priceFormatted.value
        detail.priceChange = formatPercentageValue(new BN(tokenData.value.price_change_percentage_24h || 0))
        if (priceFormatted.tooltipText) {
            detail.tooltip = priceFormatted.tooltipText
        }
    }
    return detail
})

interface PriceChange {
    title: string
    symbol: string
    icon: string
    color: string
}
const priceChange = computed<PriceChange>(() => {
    const change = priceDetail.value?.priceChange?.value || 0
    if (change > 0) {
        return {
            title: 'Price Change',
            symbol: '+',
            icon: 'arrow_upward',
            color: 'success'
        }
    }
    if (change < 0) {
        return {
            title: 'Price Change',
            symbol: '-',
            icon: 'arrow_downward',
            color: 'error'
        }
    }
    return {
        title: 'Price Change',
        symbol: '',
        icon: 'arrow_downward',
        color: 'error'
    }
})

const supplyDetail = computed<Detail>(() => {
    let supply: number | undefined = undefined
    if (tokenData.value && tokenData.value.total_supply) {
        supply = new BN(tokenData.value.total_supply).toNumber()
    }
    return {
        title: 'Max supply',
        detail: !props.isLoading && supply ? formatNumber(supply) : undefined
    }
})

const marketCapDetail = computed<Detail>(() => {
    return {
        title: 'Market Cap',
        detail: !props.isLoading && tokenData.value && tokenData.value.market_cap ? formatNumber(tokenData.value.market_cap) : undefined
    }
})

const circulatingSupplyDetail = computed<Detail>(() => {
    return {
        title: 'Circulating Supply',
        detail: !props.isLoading && tokenData.value && tokenData.value.circulating_supply ? formatNumber(tokenData.value.circulating_supply) : undefined
    }
})

const volumeDetail = computed<Detail>(() => {
    return {
        title: '24 hour trading volume',
        detail: !props.isLoading && tokenData.value && tokenData.value.total_volume ? formatNumber(tokenData.value.total_volume) : undefined
    }
})

const holderDetail = computed<Detail>(() => {
    const detail: Detail = { title: 'Holder' }
    if (!props.isLoading && props.holderDetails && props.holderDetails.owner) {
        detail.detail = props.holderDetails.owner
        detail.link = `/address/${props.holderDetails.owner}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const holderBalanceDetail = computed<Detail>(() => {
    const detail: Detail = { title: 'Balance' }
    if (!props.isLoading && props.tokenDetails && props.holderDetails) {
        const symbol = props.tokenDetails.symbol === null || !props.tokenDetails.symbol ? '' : ` ${props.tokenDetails.symbol.toUpperCase()}`
        detail.detail = `${balance.value.value}${symbol}`
        detail.tooltip = balance.value.tooltipText ? balance.value.tooltipText : undefined
    }
    return detail
})

const holderUsdDetail = computed<Detail>(() => {
    return {
        title: 'Total USD Value',
        detail: !props.isLoading && props.tokenDetails ? balanceUsd.value : undefined
    }
})

const balanceUsd = computed<string | undefined>(() => {
    if (!props.holderDetails) {
        return ''
    }

    const decimals = props.tokenDetails.decimals
    let n = new BN(props.holderDetails.balance)

    if (decimals) {
        n = n.div(new BN(10).pow(decimals))
    }

    return props.holderDetails.balance && tokenData.value && tokenData.value.current_price
        ? formatUsdValue(n.multipliedBy(tokenData.value.current_price)).value
        : undefined
})

const tokenHistory = computed<string>(() => {
    return (
        'Binance Coin (BNB) is an exchange-based token created and issued by the cryptocurrency exchange Binance. Initially created on the Ethereum blockchain as an ERC-20 token in July 2017, BNB was migrated over to Binance Chain in February 2019 and became the native coin of the Binance Chain.\n' +
        'Binance Coin has seen massive growth in interest throughout the years. Several rounds of token burn events have appreciated BNB price and pushed it up as one of the top-10 cryptocurrencies by market capitalization. BNB can be traded in over 300 trading pairs across 120 exchanges tracked. '
    )
})

const balance = computed<FormattedNumber>(() => {
    const decimals = props.tokenDetails.decimals
    let n = new BN(props.holderDetails.balance)
    if (decimals) {
        n = n.div(new BN(10).pow(decimals))
    }
    return formatFloatingPointValue(n)
})
</script>
<style lang="scss" scoped>
.token-header {
    min-height: 56px;
    .token-header-image {
        width: 30px;
    }
}
</style>
