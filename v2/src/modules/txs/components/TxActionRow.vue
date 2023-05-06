<template>
    <app-table-row row-align="center" row-justify="start" @click="toggleMoreDetails" :link="xs" :color="xs && showMoreDetails ? 'pillGrey' : 'transparent'">
        <template v-if="isNFT">
            <v-col cols="12" sm="3" md="3" class="d-flex align-center justify-start">
                <token-nft-img v-if="nftMetaDetails" :loading="false" :nft="nftMetaDetails" height="50" width="50" class="rounded-md"></token-nft-img>
                <div class="pl-5">
                    <p>{{ nftMetaDetails?.meta?.name }}</p>
                    <p v-if="smAndDown" class="text-info">{{ nftCopies }}</p>
                </div>
            </v-col>
            <v-col md="3" class="d-none d-md-flex">
                <p>{{ nftCopies }}</p>
            </v-col>
        </template>
        <template v-else>
            <v-col cols="6" sm="5" md="3">
                <component
                    :is="props.transfer.type === TransferType.Eth ? 'div' : 'router-link'"
                    :to="`/token/${props.transfer.tokenInfo?.contract}`"
                    class="d-flex justify-start align-center text-textPrimary"
                >
                    <app-token-icon :token-icon="tokenImg" img-size="32px" class="mr-2" />
                    <div>
                        <p class="text-ellipses text-textPrimary">
                            <span v-if="sm" class="mr-2 text-ellipses">{{ valueFormatted.value }}</span
                            >{{ tokenSymbol }} <span v-if="sm"><app-tooltip :text="valueFormatted.tooltipText"></app-tooltip></span>
                        </p>
                        <p class="text-ellipses text-info">{{ tokenName }}</p>
                    </div>
                </component>
            </v-col>
            <v-col cols="6" sm="3" md="4" class="d-flex d-sm-none d-md-flex justify-end justify-md-start">
                <p class="text-right text-sm-left text-ellipses">
                    {{ valueFormatted.value }} <span><app-tooltip :text="valueFormatted.tooltipText"></app-tooltip></span>
                </p>
            </v-col>
        </template>
        <template #expandable>
            <v-col v-if="xs ? showMoreDetails : true" cols="12" sm="7" md="5" lg="4">
                <div class="d-flex align-center justify-space-between justify-sm-end justify-md-space-between">
                    <div class="d-flex justify-start align-center">
                        <app-address-blockie :address="props.transfer.from" :size="8" class="mr-2 mr-md-3" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.transfer.from)" :link="`/address/${props.transfer.from}`" />
                    </div>
                    <v-icon color="success" class="mx-2 mx-md-5" :size="20">east</v-icon>
                    <div class="d-flex justify-start align-center">
                        <app-address-blockie :address="props.transfer.to" :size="8" class="mr-2 mr-md-3" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.transfer.to)" :link="`/address/${props.transfer.from}`" />
                    </div>
                </div>
            </v-col>
        </template>
    </app-table-row>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import AppTokenIcon from '@core/components/AppTokenIcon.vue'
import AppTooltip from '@/core/components/AppTooltip.vue'
import TokenNftImg from '@module/tokens/components/TokenNFT/TokenNftImg.vue'
import { computed, PropType, ref } from 'vue'
import { Action } from '../types'
import { eth } from '@core/helper'
import { TransferType } from '@/apollo/types'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useNetwork } from '@/core/composables/Network/useNetwork'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNonVariableEthValue, FormattedNumber, formatFloatingPointValue } from '@/core/helper/number-format-helper'
import { MarketDataFragment } from '@core/composables/CoinData/getLatestPrices.generated'
import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'
import { NFTDetails } from '@module/tokens/components/TokenNFT/propModel'
import BigNumber from 'bignumber.js'
import { hexToNumberString } from 'web3-utils'
const { xs, sm, smAndDown } = useDisplay()
const props = defineProps({
    transfer: {
        type: Object as PropType<Action>,
        required: true
    },
    nftMeta: {
        type: Object as PropType<NftMetaFragment>,
        required: false
    }
})

const valueFormatted = computed<FormattedNumber>(() => {
    const _value = new BigNumber(props.transfer.value)
    if (props.transfer.type === TransferType.Erc20) {
        return formatFloatingPointValue(_value.div(new BigNumber(10).pow(props.transfer.tokenInfo?.tokenInfo.decimals || 0)))
    }
    return formatNonVariableEthValue(_value)
})

const { loading: loadingMarketInfo, ethMarketInfo, getEthereumTokenByContract } = useCoinData()
const { currencyName, currencyNameLong } = useNetwork()

const erc20MarketData = computed<MarketDataFragment | undefined>(() => {
    if (!loadingMarketInfo.value && props.transfer.tokenInfo) {
        const data = getEthereumTokenByContract(props.transfer.tokenInfo.contract)
        if (data) {
            return data
        }
    }
    return undefined
})
const tokenImg = computed<string | undefined>(() => {
    if (!loadingMarketInfo.value) {
        if (props.transfer.type === TransferType.Eth) {
            return ethMarketInfo.value?.image
        }
        if (props.transfer.type === TransferType.Erc20 && props.transfer.tokenInfo) {
            return erc20MarketData.value?.image || props.transfer.tokenInfo.tokenInfo.iconPng || undefined
        }
    }
    return undefined
})

const tokenSymbol = computed<string>(() => {
    if (props.transfer.type === TransferType.Eth) {
        return currencyName.value.toUpperCase()
    }
    if (props.transfer.type === TransferType.Erc20) {
        const symbol = erc20MarketData.value?.symbol.toUpperCase() || props.transfer.tokenInfo?.tokenInfo.symbol?.toUpperCase()
        if (symbol) {
            return symbol
        }
    }
    return 'NO NAME'
})

const tokenName = computed<string>(() => {
    if (props.transfer.type === TransferType.Eth) {
        return currencyNameLong.value
    }
    if (props.transfer.type === TransferType.Erc20) {
        const name = erc20MarketData.value?.name || props.transfer.tokenInfo?.tokenInfo.name
        if (name) {
            return name
        }
    }
    return 'NO NAME'
})

/** -------------------
 * NFT
 * --------------------*/

const isNFT = computed<boolean>(() => {
    return props.transfer.type === TransferType.Erc1155 || props.transfer.type === TransferType.Erc721
})

const nftMetaDetails = computed<NFTDetails | undefined>(() => {
    if (isNFT.value && props.nftMeta) {
        return {
            type: props.transfer.type,
            contract: props.transfer.tokenInfo?.contract || '',
            id: hexToNumberString(props.transfer.nftId || '0x'),
            meta: props.nftMeta
        }
    }
    return undefined
})

const nftCopies = computed<string>(() => {
    if (props.transfer.type === TransferType.Erc1155) {
        const total = new BigNumber(props.transfer.value)
        const str = total.gt(1) ? 'copies' : 'copy'
        return `${formatFloatingPointValue(total).value} ${str}`
    }
    return ''
})
const showMoreDetails = ref(false)

const toggleMoreDetails = (): void => {
    showMoreDetails.value = !showMoreDetails.value
}
</script>
