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
            <v-card elevation="1" rounded="xl">
                <v-tabs v-model="state.tab" color="primary" end>
                    <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Transfers</v-tab>
                    <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Holders</v-tab>
                </v-tabs>
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
                        @isNft="setTokenType"
                    />
                </div>
            </v-card>
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
import { Q_TOKEN_DETAILS } from '@core/router/routesNames'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const routes = Q_TOKEN_DETAILS

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
}

const state: ComponentState = reactive({
    address: '',
    hasError: false,
    isNft: true,
    tab: ''
})
/**------------------------
 * Route Handling
 -------------------------*/

const router = useRouter()
const route = useRoute()
/**
 * Sets route query if new tab is selected
 */
const changeRoute = () => {
    if (route.query.t !== state.tab) {
        router.push({
            query: { t: state.tab }
        })
    }
}
/**
 * Watches for changes in the router
 * in case user manipulates history
 * and updates tab accordingly
 */
onBeforeRouteUpdate(async to => {
    if (to.query.t !== state.tab) {
        state.tab = state.tab === routes[0] ? routes[1] : routes[0]
    }
})

const emit = defineEmits<{
    (e: 'errorDetails', value: boolean, message: string): void
}>()

onMounted(() => {
    if (!isValid.value) {
        state.hasError = true
        emitErrorState(true, ErrorMessageToken.invalid)
        return
    }
    state.tab = props.tab
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
const setTokenType = (val: boolean) => {
    state.isNft = val
}
</script>
