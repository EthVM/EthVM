<template>
    <div>
        <!--
    =====================================================================================
      BASIC VIEW

      Will show details if URL does NOT include query param "holder"
      Shows details pertinent to the token as a whole, with no holder-specific information
    =====================================================================================
    -->
        <div v-if="!props.isHolder">
            <token-details-list
                :holder-details="null"
                :address-ref="props.addressRef"
                :token-details="tokenDetails"
                :is-nft="state.isNft"
                :is-loading="loadingTokenDetails || state.hasError"
                @errorDetails="emitErrorState"
            />
            <app-tabs :tabs="tabsTokenDetails">
                <v-window-item value="tab-0">
                    <token-transfers :address="props.addressRef" :page-type="'token'" :decimals="decimals" :symbol="symbol" @errorDetails="emitErrorState" />
                </v-window-item>
                <v-window-item value="tab-1">
                    <token-holders :address="props.addressRef" :decimals="decimals" @errorDetails="emitErrorState" />
                </v-window-item>
            </app-tabs>
        </div>
        <!--
    =====================================================================================
      HOLDER VIEW

      Will show details if the URL DOES include query param "holder"
      Shows holder details pertaining to particular token contract
    =====================================================================================
    -->
        <div v-if="props.isHolder">
            <token-details-list
                :address-ref="props.addressRef"
                :holder-details="tokenDetails"
                :token-details="tokenDetails ? tokenDetails['tokenInfo'] : {}"
                :is-loading="loadingTokenDetails || state.hasError"
                @errorDetails="emitErrorState"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import AppTabs from '@core/components/AppTabs'
import TokenDetailsList from '@module/tokens/components/TokenDetailsList.vue'
import TokenTransfers from '@module/tokens/components/TokenTransfers.vue'
import TokenHolders from '@module/tokens/components/TokenHolders.vue'
import {
    Erc20TokenOwnerDetailsFragment as TokenOwnerInfo,
    TokenDetailsFragment as TokenInfo,
    useGetErc20TokenBalanceQuery,
    useGetTokenInfoByContractQuery
} from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { eth } from '@core/helper'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { Tab } from '@core/components/props'

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
    }
})

interface ComponentState {
    address: string
    hasError: boolean
    isNft: boolean
}

const state: ComponentState = reactive({
    address: '',
    hasError: false,
    isNft: true
})

const emit = defineEmits(['errorDetails'])

onMounted(() => {
    if (!isValid.value) {
        state.hasError = true
        emitErrorState(true, ErrorMessageToken.invalid)
        return
    }
    window.scrollTo(0, 0)
})

const {
    loading: loadingTokenDetails,
    onError: onTokenDetailsError,
    result
} = props.isHolder
    ? useGetErc20TokenBalanceQuery({
          contract: props.addressRef,
          owner: props.holderAddress
      })
    : useGetTokenInfoByContractQuery({
          contract: props.addressRef
      })

onTokenDetailsError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.includes('Token not found')) {
        emitErrorState(true, ErrorMessageToken.notFound)
    } else {
        emitErrorState(true, ErrorMessageToken.details)
    }
})

const tokenDetails = computed<TokenInfo | TokenOwnerInfo>(() => {
    if (result && result.value) {
        if (props.isHolder) {
            return result.value.getERC20TokenBalance
        }
        return result.value.getTokenInfoByContract
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
        return tokenDetails.value['tokenInfo'] ? tokenDetails.value['tokenInfo'].symbol : tokenDetails.value['symbol']
    }
    return null
})

const decimals = computed<string | null>(() => {
    if (tokenDetails.value) {
        return tokenDetails.value['tokenInfo'] ? tokenDetails.value['tokenInfo'].decimals : tokenDetails.value['decimals']
    }
    return null
})

const tabsTokenDetails = computed<Tab[]>(() => {
    const tabs = [
        {
            id: 0,
            title: 'Transfers',
            isActive: true
        },
        {
            id: 1,
            title: 'Holders',
            isActive: false
        }
    ]
    return tabs
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
</script>
