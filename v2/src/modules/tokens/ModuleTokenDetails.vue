<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                <p class="mb-4 text-h4 font-weight-bold">Contract</p>
                <v-row align="center" no-gutters>
                    <v-col cols="12" sm="7" lg="8">
                        <div class="d-flex align-center justify-start mb-5 mb-sm-0 pr-sm-10">
                            <app-address-blockie :address="props.addressRef" :size="8" key="identicon" class="mr-3" />
                            <app-transform-hash
                                :hash="eth.toCheckSum(props.addressRef)"
                                :show-name="false"
                                is-blue
                                :link="`/address/${props.addressRef}`"
                            /></div
                    ></v-col>
                    <v-col cols="6" sm="3" lg="2">
                        <p v-if="state.standard !== ''" class="font-weight-bold">Token Standard</p>
                        <p v-if="state.standard !== ''">{{ state.standard }}</p>
                        <div v-else class="skeleton-box rounded-xl mr-10" style="height: 40px; width: 120px"></div>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <p class="font-weight-bold">{{ leftTitle }}</p>
                        <p class="text-body">{{ leftText }}</p>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <!-- <token-details-list
                :holder-details="null"
                :address-ref="props.addressRef"
                :token-details="tokenDetails"
                :is-nft="state.isNft"
                :is-loading="loadingTokenDetails || state.hasError"
                @errorDetails="emitErrorState"
            /> -->
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs"></app-tabs>
                <div class="mt-6">
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
                </div>
            </v-card>
        </v-col>
    </v-row>

    <!-- <div> -->
    <!--
    =====================================================================================
      BASIC VIEW

      Will show details if URL does NOT include query param "holder"
      Shows details pertinent to the token as a whole, with no holder-specific information
    =====================================================================================
    -->
    <!-- <div v-if="!props.isHolder">

            <token-details-list
                :holder-details="null"
                :address-ref="props.addressRef"
                :token-details="tokenDetails"
                :is-nft="state.isNft"
                :is-loading="loadingTokenDetails || state.hasError"
                @errorDetails="emitErrorState"
            />
           
        </div> -->
    <!--
    =====================================================================================
      HOLDER VIEW

      Will show details if the URL DOES include query param "holder"
      Shows holder details pertaining to particular token contract
    =====================================================================================
    -->
    <!-- <div v-if="props.isHolder">
            <token-details-list
                :address-ref="props.addressRef"
                :holder-details="tokenDetails"
                :token-details="tokenDetails ? tokenDetails['tokenInfo'] : {}"
                :is-loading="loadingTokenDetails || state.hasError"
                @errorDetails="emitErrorState"
            />
        </div>
    </div> -->
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import TokenDetailsList from '@module/tokens/components/TokenDetailsList.vue'
import TokenTransfers from '@module/tokens/components/TokenTransfers.vue'
import TokenHolders from '@module/tokens/components/TokenHolders.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import {
    Erc20TokenOwnerDetailsFragment as TokenOwnerInfo,
    TokenDetailsFragment as TokenInfo,
    useGetErc20TokenBalanceQuery,
    useGetTokenInfoByContractQuery,
    GetErc20TokenBalanceQuery,
    GetTokenInfoByContractQuery
} from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { eth } from '@core/helper'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { Q_TOKEN_DETAILS } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import { TransferType } from '@/apollo/types'
const { columnPadding, rowMargin } = useAppViewGrid()
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
    isHolder: {
        type: Boolean,
        required: true
    },
    holderAddress: {
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
    isNft: boolean
    tab: string
    standard: string
}

const state: ComponentState = reactive({
    address: '',
    hasError: false,
    isNft: true,
    tab: props.tab,
    standard: ''
})
/**------------------------
 * Route Handling
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
} = props.isHolder
    ? useGetErc20TokenBalanceQuery(() => ({
          contract: props.addressRef,
          owner: props.holderAddress
      }))
    : useGetTokenInfoByContractQuery(() => ({
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

const tokenDetails = computed<TokenInfo | TokenOwnerInfo | null>(() => {
    if (result && result.value) {
        if (props.isHolder) {
            const res = result.value as GetErc20TokenBalanceQuery
            return res.getERC20TokenBalance as TokenOwnerInfo
        }
        const res = result.value as GetTokenInfoByContractQuery
        console.log(res.getTokenInfoByContract)

        return res.getTokenInfoByContract
    }
    return null
})

/*
===================================================================================
COMPUTED PROPERTIES:
===================================================================================
*/

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

const symbol = computed<string | null>(() => {
    if (tokenDetails.value) {
        if (tokenDetails.value.__typename === 'ERC20TokenBalance' && tokenDetails.value.tokenInfo.symbol) {
            return tokenDetails.value.tokenInfo.symbol
        }
        if (tokenDetails.value.__typename === 'EthTokenInfo' && tokenDetails.value.symbol) {
            return tokenDetails.value.symbol
        }
    }
    return null
})

const decimals = computed<number | null>(() => {
    if (tokenDetails.value) {
        if (tokenDetails.value.__typename === 'ERC20TokenBalance' && tokenDetails.value.tokenInfo.decimals) {
            return tokenDetails.value.tokenInfo.decimals
        }
        if (tokenDetails.value.__typename === 'EthTokenInfo' && tokenDetails.value.decimals) {
            return tokenDetails.value.decimals
        }
    }
    return null
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
        return '50+'
    }
    return ''
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
