<template>
    <v-row :class="rowMargin">
        <!--
        =====================================================================================
        Contract OverView: Hash, Standard Type, Decimals/Collections
        =====================================================================================
        -->
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                <v-row no-gutters>
                    <v-col cols="12" md="auto" lg="4" order="last" order-md="first">
                        <p class="mb-4 text-h4 font-weight-bold">Contract</p>
                    </v-col>
                    <v-spacer />
                    <v-col cols="12" md="auto" lg="8" order="first" order-md="last" class="mb-6 mb-md-6 pa-0">
                        <app-ad-buttons-small />
                    </v-col>
                </v-row>
                <v-row align="center" no-gutters>
                    <v-col cols="12" sm="7" lg="8">
                        <div class="d-flex align-center justify-start mb-5 mb-sm-0 pr-sm-10">
                            <app-address-blockie :address="props.addressRef" :size="8" key="identicon" class="mr-3" />
                            <app-transform-hash :hash="eth.toCheckSum(props.addressRef)" :show-name="false" is-blue :link="`/address/${props.addressRef}`" />
                            <app-copy-to-clip :value-to-copy="eth.toCheckSum(props.addressRef)" class="mx-3" /></div
                    ></v-col>
                    <v-col cols="6" sm="3" lg="2">
                        <p v-if="state.standard !== ''" class="font-weight-bold">Token Standard</p>
                        <p v-if="state.standard !== ''">{{ state.standard }}</p>
                        <div v-else class="skeleton-box rounded-xl mr-10" style="height: 40px; width: 120px"></div>
                    </v-col>
                    <v-col cols="6" sm="2" v-if="showLeftText">
                        <p v-if="leftText !== ''" class="font-weight-bold">{{ leftTitle }}</p>
                        <p v-if="leftText !== ''" class="text-body">{{ leftText }}</p>
                        <div v-else class="skeleton-box rounded-xl mr-10" style="height: 40px; width: 120px"></div>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <!--
        =====================================================================================
        Contract Details
        =====================================================================================
        -->
        <v-col cols="12" :class="columnPadding" v-if="showContractDetails">
            <v-card elevation="1" rounded="xl" class="h-100 pa-4 pa-sm-6">
                <div v-if="showLoading" class="skeleton-box rounded-xl my-2" style="height: 280px"></div>
                <div v-else>
                    <token-details-erc20
                        v-if="tokenDetails && state.standard === TransferType.Erc20"
                        :address-ref="props.addressRef"
                        :token-details="tokenDetails"
                        :is-loading="loadingTokenDetails || state.hasError"
                        @errorDetails="emitErrorState"
                    />
                    <v-carousel
                        v-if="nftDetails && (state.standard === TransferType.Erc721 || state.standard === TransferType.Erc1155)"
                        :show-arrows="showMoreBtn"
                        hide-delimiters
                        height="auto"
                        v-model="state.activeCollection"
                    >
                        <template #prev="{ props }">
                            <app-btn-icon icon="chevron_left" @click="props.onClick" size="large" />
                        </template>
                        <template #next="{ props }">
                            <app-btn-icon icon="chevron_right" @click="props.onClick" size="large" />
                        </template>
                        <v-carousel-item v-for="(collection, index) in nftDetails" :key="index">
                            <token-details-nft :collection="collection" :is-loading="loadingNftMeta || state.hasError" />
                        </v-carousel-item>
                    </v-carousel>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <!--
        =====================================================================================
        Contract Holders and Transfers
        =====================================================================================
        -->
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mx-n1 mt-n2 mb-4"></app-tabs>
                <token-transfers
                    v-show="state.tab === routes[0]"
                    :address="props.addressRef"
                    :page-type="'token'"
                    :decimals="decimals"
                    :symbol="symbol"
                    @errorDetails="emitErrorState"
                />
                <token-holders
                    v-show="state.tab === routes[1]"
                    :address="props.addressRef"
                    :decimals="decimals"
                    @errorDetails="emitErrorState"
                    @setTokenType="setTokenType"
                />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import TokenDetailsErc20 from '@module/tokens/components/TokenDetails/TokenDetailsERC20.vue'
import TokenDetailsNft from '@module/tokens/components/TokenDetails/TokenDetailsNFT.vue'
import TokenTransfers from '@module/tokens/components/TokenTransfers.vue'
import TokenHolders from '@module/tokens/components/TokenHolders.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import AppAdButtonsSmall from '@/core/components/AppAdButtonsSmall.vue'
import { Tab } from '@core/components/props'
import {
    TokenDetailsFragment as TokenInfo,
    useGetTokenInfoByContractQuery,
    GetTokenInfoByContractQuery,
    useGetNftContractMetaQuery,
    NftCollectionFragment
} from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { eth } from '@core/helper'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { Q_TOKEN_DETAILS } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import { TransferType } from '@/apollo/types'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useNetwork } from '@/core/composables/Network/useNetwork'
const { supportsNft } = useNetwork()

const { columnPadding, rowMargin } = useAppViewGrid()
const { loading: loadingCoinData } = useCoinData()

const routes = Q_TOKEN_DETAILS
const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Transfers'
    },
    {
        value: routes[1],
        title: 'Holders'
    }
]

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    tab: {
        type: String,
        required: true
    }
})

interface ComponentState {
    address: string
    hasError: boolean
    tab: string
    standard: string
    activeCollection: number
}

const state: ComponentState = reactive({
    address: '',
    hasError: false,
    tab: props.tab,
    standard: '',
    activeCollection: 1
})

/**------------------------
 * ERC20 Tokens
 -------------------------*/

const emit = defineEmits<{
    (e: 'errorDetails', value: boolean, message: string): void
}>()

onMounted(() => {
    if (!isValid.value) {
        state.hasError = true
        emitErrorState(true, ErrorMessageToken.invalid)
        return
    }
})

const {
    loading: loadingTokenDetails,
    onError: onTokenDetailsError,
    result
} = useGetTokenInfoByContractQuery(() => ({
    contract: props.addressRef
}))

onTokenDetailsError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.includes('Token not found')) {
        emitErrorState(true, ErrorMessageToken.notFound)
    } else {
        emitErrorState(true, ErrorMessageToken.details)
    }
})

const tokenDetails = computed<TokenInfo | null>(() => {
    if (result && result.value) {
        const res = result.value as GetTokenInfoByContractQuery
        return res.getTokenInfoByContract
    }
    return null
})

/*
===================================================================================
Collection Meta:
===================================================================================
*/
const {
    loading: loadingNftMeta,
    result: nftMetaResult,
    fetchMore: fetchMoreCollections
} = useGetNftContractMetaQuery(
    () => ({
        input: props.addressRef
    }),
    () => ({
        clientId: 'nftClient',
        enabled: state.standard === TransferType.Erc1155 || state.standard === TransferType.Erc721
    })
)

const nftDetails = computed<NftCollectionFragment[] | undefined>(() => {
    return nftMetaResult.value?.getNFTContractMeta?.collections
})

const hasMoreCollections = computed<boolean>(() => {
    return !!nftMetaResult.value?.getNFTContractMeta?.nextKey
})

const showMoreBtn = computed<boolean>(() => {
    return !!nftDetails.value && nftDetails.value?.length > 1
})

/**
 * Fetches more Collections, once user reached n-10 collections, where n is collections length
 */
watch(
    () => state.activeCollection,
    newValue => {
        if (nftDetails.value && hasMoreCollections.value) {
            const fetchAt = nftDetails.value.length - 10
            if (newValue === fetchAt && !loadingNftMeta.value) {
                const cleanNextKey = nftMetaResult.value?.getNFTContractMeta?.nextKey?.substring(53) || ''
                fetchMoreCollections({
                    variables: {
                        input: cleanNextKey
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const prev = previousResult.getNFTContractMeta?.collections || []
                        const next = fetchMoreResult?.getNFTContractMeta?.collections || []
                        return {
                            __typename: 'Query',
                            getNFTContractMeta: {
                                nextKey: fetchMoreResult?.getNFTContractMeta?.nextKey,
                                collections: [...prev, ...next]
                            }
                        }
                    }
                })
            }
        }
    }
)

/*
===================================================================================
COMPUTED PROPERTIES:
===================================================================================
*/

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

const symbol = computed<string | undefined>(() => {
    if (tokenDetails.value) {
        return tokenDetails.value.symbol || undefined
    }
    return undefined
})

const decimals = computed<number | undefined>(() => {
    if (tokenDetails.value) {
        return tokenDetails.value.decimals || undefined
    }
    return undefined
})

const leftTitle = computed<string>(() => {
    if (state.standard === TransferType.Erc1155 || state.standard === TransferType.Erc721) {
        return 'Collections'
    }
    if (state.standard === TransferType.Erc20) {
        return 'Decimals'
    }
    return ''
})

const leftText = computed<string>(() => {
    if (state.standard === TransferType.Erc20 && decimals.value) {
        return decimals.value.toString()
    }
    if (state.standard === TransferType.Erc1155 || state.standard === TransferType.Erc721) {
        if (!loadingNftMeta.value && nftMetaResult.value?.getNFTContractMeta) {
            const addSign = nftMetaResult.value?.getNFTContractMeta.nextKey ? '+' : ''
            return `${nftMetaResult.value?.getNFTContractMeta.collections.length}${addSign}`
        }
    }
    return ''
})

const showLeftText = computed<boolean>(() => {
    return supportsNft.value ? true : state.standard === TransferType.Erc20
})

const showLoading = computed<boolean>(() => {
    if (state.standard === TransferType.Erc20) {
        return loadingCoinData.value || tokenDetails.value === null
    }
    if (state.standard === TransferType.Erc1155 || state.standard === TransferType.Erc721) {
        return loadingNftMeta.value || nftDetails.value === undefined
    }
    return true
})

const showContractDetails = computed<boolean>(() => {
    if (state.standard === TransferType.Erc20) {
        return true
    }
    if (state.standard === TransferType.Erc1155 || state.standard === TransferType.Erc721) {
        return supportsNft.value
    }
    return true
})
/*
===================================================================================
METHODS:
===================================================================================
*/

/**
 * Sets error messages if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageBlock}
 */
const emitErrorState = (val: boolean, message: ErrorMessageToken): void => {
    state.hasError = val
    emit('errorDetails', val, message)
}

/**
 * Sets whether a token is erc721 or erc20
 * @param val {Boolean}
 */
const setTokenType = (val: string) => {
    state.standard = val
}

/**
 * Resets ContractToken Type on load
 */
watch(
    () => props.addressRef,
    (newAdr, oldAdr) => {
        if (newAdr.toLowerCase() !== oldAdr.toLowerCase()) {
            state.standard = ''
        }
    }
)
</script>
