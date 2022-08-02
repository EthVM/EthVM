<template>
    <v-row row wrap justify="start" class="mb-4">
        <v-col xs="12">
            <app-details-list :title="title" :details="details" :is-loading="props.isLoading || state.hasError" :max-items="10" class="mb-4">
                <template #title>
                    <v-row grid-list-xs row align="center" justify="space-between" class="fill-height pl-4 pr-2 my-0">
                        <v-col>
                            <v-row grid-list-xs row align="center" justify="start" class="token-header">
                                <div class="token-header-image">
                                    <v-img :src="image" contain @error="imgLoadFail" />
                                </div>
                                <v-card-title class="title font-weight-bold pl-3">{{ title }}</v-card-title>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-divider class="lineGrey" />
                </template>
            </app-details-list>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { Detail } from '@core/components/props'
import AppDetailsList from '@core/components/AppDetailsList.vue'
import { Hex } from '@core/models'
import BN from 'bignumber.js'
import { formatFloatingPointValue, formatNumber, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import {
    GetErc20TokenBalanceQuery as TokenOwnerInfo,
    GetTokenInfoByContractQuery as TokenInfo
} from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { computed } from 'vue'
import { MarketDataFragment as TokenMarketData } from '@/core/composables/CoinData/getLatestPrices.generated'

interface PropType {
    addressRef: string
    isLoading: boolean
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
const { getEthereumTokenByContract } = useCoinData()
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

const image = computed<string>(() => {
    return !(tokenData.value && tokenData.value.image && state.imageExists) ? require('@/assets/icon-token.png') : tokenData.value.image
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

const contractDetail = computed<Detail[]>(() => {
    const detail: Detail = { title: 'Contract' }
    if (!props.isLoading && props.tokenDetails) {
        detail.detail = new Hex(props.tokenDetails.contract).toString()
        detail.link = `/address/${new Hex(props.tokenDetails.contract).toString()}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const contractOwnerDetail = computed<Detail[]>(() => {
    const detail: Detail = { title: 'Owner' }
    if (!props.isLoading && props.holderDetails && props.holderDetails.owner) {
        detail.detail = props.holderDetails.owner
        detail.link = `/address/${props.holderDetails.owner}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const contractDecimalsDetail = computed<Detail[]>(() => {
    return {
        title: 'Decimals',
        detail: !props.isLoading && props.tokenDetails && props.tokenDetails.decimals != null ? props.tokenDetails.decimals : undefined
    }
})

const priceDetail = computed<Detail[]>(() => {
    const detail: Detail = { title: 'Price' }
    if (!props.isLoading && tokenData.value) {
        const priceFormatted = formatUsdValue(new BN(tokenData.value.current_price || 0))
        detail.detail = priceFormatted.value
        detail.priceChange = tokenData.value.price_change_percentage_24h
        if (priceFormatted.tooltipText) {
            detail.tooltip = priceFormatted.tooltipText
        }
    }
    return detail
})

const supplyDetail = computed<Detail[]>(() => {
    let supply: number | undefined = undefined
    if (tokenData.value && tokenData.value.total_supply) {
        supply = new BN(tokenData.value.total_supply).toNumber()
    }
    return {
        title: 'Total supply',
        detail: !props.isLoading && supply ? formatNumber(supply) : undefined
    }
})

const marketCapDetail = computed<Detail[]>(() => {
    return {
        title: 'Market Cap',
        detail: !props.isLoading && tokenData.value && tokenData.value.market_cap ? formatNumber(tokenData.value.market_cap) : undefined
    }
})

const volumeDetail = computed<Detail[]>(() => {
    return {
        title: 'Volume',
        detail: !props.isLoading && tokenData.value && tokenData.value.total_volume ? formatNumber(tokenData.value.total_volume) : undefined
    }
})

const holderDetail = computed<Detail[]>(() => {
    const detail: Detail = { title: 'Holder' }
    if (!props.isLoading && props.holderDetails && props.holderDetails.owner) {
        detail.detail = props.holderDetails.owner
        detail.link = `/address/${props.holderDetails.owner}`
        detail.copy = true
        detail.toChecksum = true
    }
    return detail
})

const holderBalanceDetail = computed<Detail[]>(() => {
    const detail: Detail = { title: 'Balance' }
    if (!props.isLoading && props.tokenDetails && props.holderDetails) {
        const symbol = props.tokenDetails.symbol === null || !props.tokenDetails.symbol ? '' : ` ${props.tokenDetails.symbol.toUpperCase()}`
        detail.detail = `${balance.value.value}${symbol}`
        detail.tooltip = balance.value.tooltipText ? balance.value.tooltipText : undefined
    }
    return detail
})

const holderUsdDetail = computed<Detail[]>(() => {
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
