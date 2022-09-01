<template>
    <v-card :variant="!props.isOverview ? 'flat' : 'elevated'" :elevation="props.isOverview ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title class="d-none d-sm-flex justify-space-between align-center pa-0">
            <div>
                <span v-if="props.isOverview" class="text-h6 font-weight-bold">Token Balance</span>
                <!-- Notice new update-->
                <app-new-update
                    :icon-only="props.isOverview"
                    text="Token's Balance Changed, Refresh"
                    :update-count="props.newErc20Transfer"
                    @reload="setPage(0, true)"
                />
            </div>
            <template v-if="props.isOverview">
                <app-btn text="More" is-small icon="east" @click="goToTokensBalancePage"></app-btn>
            </template>
        </v-card-title>
        <address-balance-totals
            title="Token Balance"
            :is-loading="loadingTokens || loadingCoinData"
            :balance="tokenBalance"
            :subtext="`${tokens.length} total tokens`"
            :class="{ 'd-sm-none': props.isOverview }"
        >
        </address-balance-totals>

        <!--Table Header-->
        <v-row :dense="xs" class="d-flex text-body-1 text-info my-2 my-sm-5">
            <!--
                Token on Overview:
                XS: NONE
                SM and UP: 4
                ------------
                Token:
                XS: NONE
                SM : 4
                LG: 2 
             -->
            <v-col sm="4" :lg="props.isOverview ? 4 : 2" class="py-0 d-none d-sm-block"> Token</v-col>
            <!--
                Symbol on Overview:
                XS and UP: NONE
                ------------
                Symbol
                XS: NONE
                LG: 1
             -->
            <v-col v-if="!props.isOverview" sm="1" class="py-0 d-none d-lg-block"> Symbol</v-col>
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
            <v-col cols="12" sm="8" lg="9" class="d-none d-sm-flex">
                <v-row>
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 text-right text-sm-left"> Price</v-col>
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-lg-block"> 24h</v-col>
                    <v-col v-if="!props.isOverview" lg="3" class="py-0 d-none d-sm-block"> USD Value</v-col>
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-sm-flex justify-space-between">
                        <p>Balance</p>
                        <p v-if="!props.isOverview" class="text-right">More</p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-0 mx-n4 mx-sm-n6 mb-1 mb-sm-5" />
        <!--Loading -->
        <v-row v-if="loadingTokens || loadingCoinData">
            <v-col v-for="col in 10" :key="col" cols="12" class="my-1">
                <div class="skeleton-box rounded-xl" style="min-height: 44px"></div>
            </v-col>
        </v-row>
        <!--Token Row -->
        <div v-else>
            <v-row
                :dense="xs"
                v-for="token in tokens"
                :key="token.contract"
                class="text-body-1 my-3 mt-sm-0 mb-sm-5 flex-row align-start align-lg-center"
                align="start"
            >
                <!--
                Token on Overview:
                XS: NONE
                SM and UP: 4
                ------------
                Token:
                XS: NONE
                SM : 4
                LG: 2 
             -->
                <v-col cols="6" sm="4" :lg="props.isOverview ? 4 : 2" :class="['pb-0', 'd-flex align-center']">
                    <app-token-icon :token-icon="token.image || undefined" />
                    <p class="text-truncate ml-4">
                        {{ token.name }}
                        <span v-if="props.isOverview || mdAndDown" class="text-info text-uppercase text-truncate d-block">{{ token.symbol }}</span>
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
                <v-col v-if="!props.isOverview" cols="1" class="pb-0 d-none d-lg-block">
                    <p class="text-uppercase text-truncate text-info">{{ token.symbol }}</p>
                </v-col>
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
                <v-col cols="6" sm="8" lg="9">
                    <v-row class="align-start align-lg-center">
                        <!-- Price-->
                        <v-col cols="4" :lg="props.isOverview ? 4 : 3" class="pb-0 d-none d-sm-block">
                            <p>{{ token.current_price }}</p>
                            <p :class="[priceChangeClass(token), 'd-lg-none mt-1']">{{ token.getPriceChangeFormatted() }}</p>
                        </v-col>
                        <!-- Price Change-->
                        <v-col v-if="!props.isOverview" lg="3" class="py-0 d-none d-lg-block">
                            <p :class="priceChangeClass(token)">{{ token.getPriceChangeFormatted() }}</p>
                        </v-col>
                        <!-- 
                            USD Value -->
                        <v-col cols="12" sm="4" :lg="props.isOverview ? 4 : 3" class="pb-0 d-none d-sm-block">
                            <p class="text-right text-sm-left">{{ token.getUSDValueFormatted() }}</p>
                        </v-col>
                        <!-- Balance -->
                        <v-col
                            cols="12"
                            sm="4"
                            :lg="props.isOverview ? 4 : 3"
                            class="pb-0 d-block d-sm-flex justify-sm-space-between align-start align-lg-center"
                        >
                            <p class="text-right text-sm-left">{{ token.getBalanceFormatted() }}</p>
                            <p class="d-sm-none text-right text-sm-left text-info mt-1">{{ token.getUSDValueFormatted() }}</p>
                            <div v-if="!props.isOverview && getEthereumTokenByContract(token.contract)" class="mt-n2 mt-lg-0">
                                <app-btn-icon
                                    :icon="state.showMoreTokenDetails && state.activeToken.contract === token.contract ? 'expand_less' : 'expand_more'"
                                    size="small"
                                    @click="showTokenDetails(token.contract)"
                                    class="d-none d-sm-block"
                                ></app-btn-icon>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>

                <!-- <v-col cols="2">{{ formatFloatingPointValue(token.balance).value }}</v-col>
            <v-col cols="2">{{ formatFloatingPointValue(token.usdValue).value }}</v-col> -->
                <!-- <v-col cols="1"> -->
                <!-- <v-row v-if="priceChangeFormatted(token)" class="ma-0">
                    <p :class="priceChangeClass(token)">{{ priceChangeFormatted(token).value }}%</p>
                    <span>
                        <v-icon v-if="change(token) < 0" color="error" size="x-small">south_east</v-icon>
                        <v-icon v-else color="success" size="x-small">north_east</v-icon>
                    </span>
                </v-row>
            </v-col> -->
                <!-- <v-col cols="2">
                <p v-if="token.current_price">
                    {{ token.current_price }}
                </p>
            </v-col> -->
                <!--  -->
                <!-- <v-col v-if="state.showMoreTokenDetails && state.activeToken.contract === token.contract" cols="12">
                <v-row class="mx-0">
                    <v-col cols="6">
                        <v-row class="ma-0" justify="space-between" align="center">
                            <p class="font-weight-light">Market Cap</p>
                            <p>{{ BN(state.activeToken.market_cap).toFormat() }}</p>
                        </v-row>
                        <v-divider />
                    </v-col>
                    <v-col cols="6">
                        <v-row class="ma-0" justify="space-between" align="center">
                            <p class="font-weight-light">Circulating Supply</p>
                            <p>{{ state.activeToken.total_supply }}</p>
                        </v-row>
                        <v-divider />
                    </v-col>
                    <v-col cols="6">
                        <v-row class="ma-0" justify="space-between" align="center">
                            <p class="font-weight-light">24 Hour Trading Vol</p>
                            <p>{{ state.activeToken.total_volume }}</p>
                        </v-row>
                        <v-divider />
                    </v-col>
                </v-row>
            </v-col> -->
            </v-row>
        </div>

        <!-- <v-card>
        <v-card-title class="justify-space-between">
            <div>
                HRC20 token balance
                <app-new-update text="Token's Balance Changed, Refresh" :update-count="props.newErc20Transfer" hide-count @reload="setPage(0, true)" />
            </div>
            <app-paginate v-if="!initialLoad" :total="totalPages" :current-page="state.index" @newPage="setPage" />
        </v-card-title> -->
        <div>
            <!--            Table Header-->
            <!-- <v-row class="ma-0 bg-primary">
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Token
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('name')">
                            <v-icon v-if="state.sortKey === `name_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Symbol
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('symbol')">
                            <v-icon v-if="state.sortKey === `symbol_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        Balance
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('balance')">
                            <v-icon v-if="state.sortKey === `balance_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center">
                        USD Value
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('amount_usd')">
                            <v-icon v-if="state.sortKey === `amount_usd_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0 flex-nowrap" align="center">
                        24HR
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('change')">
                            <v-icon v-if="state.sortKey === `change_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center">
                        Price
                        <v-btn icon variant="text" size="x-small" class="ml-2" @click="sortTable('price')">
                            <v-icon v-if="state.sortKey === `price_${state.sortDirection}` && state.sortDirection === 'high'">arrow_drop_down</v-icon>
                            <v-icon v-else>arrow_drop_up</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="1">More</v-col>
            </v-row> -->
            <!-- <template v-else>
                <v-row v-for="token in tokens" :key="token.contract" class="ma-0 text-subtitle-2 font-weight-regular" align="center">
                    <v-col cols="2">
                        <v-row class="ma-0" align="center">
                            <img :src="token.image || require('@/assets/icon-token.png')" alt="" height="24" width="24" class="mr-2" />
                            <span class="font-weight-medium">{{ token.name }}</span>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        {{ token.symbol }}
                    </v-col>
                    <v-col cols="2">{{ formatFloatingPointValue(token.balance).value }}</v-col>
                    <v-col cols="2">{{ formatFloatingPointValue(token.usdValue).value }}</v-col>
                    <v-col cols="1">
                        <v-row v-if="priceChangeFormatted(token)" class="ma-0">
                            <p :class="priceChangeClass(token)">{{ priceChangeFormatted(token).value }}%</p>
                            <span>
                                <v-icon v-if="change(token) < 0" color="error" size="x-small">south_east</v-icon>
                                <v-icon v-else color="success" size="x-small">north_east</v-icon>
                            </span>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <p v-if="token.current_price">
                            {{ token.current_price }}
                        </p>
                    </v-col>
                    <v-col cols="1">
                        <v-btn v-if="getEthereumTokenByContract(token.contract)" icon size="small" @click="showTokenDetails(token.contract)">
                            <v-icon v-if="state.showMoreTokenDetails && state.activeToken.contract === token.contract">expand_less</v-icon>
                            <v-icon v-else>expand_more</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col v-if="state.showMoreTokenDetails && state.activeToken.contract === token.contract" cols="12">
                        <v-row class="mx-0">
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">Market Cap</p>
                                    <p>{{ BN(state.activeToken.market_cap).toFormat() }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">Circulating Supply</p>
                                    <p>{{ state.activeToken.total_supply }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                            <v-col cols="6">
                                <v-row class="ma-0" justify="space-between" align="center">
                                    <p class="font-weight-light">24 Hour Trading Vol</p>
                                    <p>{{ state.activeToken.total_volume }}</p>
                                </v-row>
                                <v-divider />
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-divider />
                </v-row>
            </template> -->
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppBtn from '@/core/components/AppBtn.vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, Token } from '@module/address/models/TokenSort'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { xs, mdAndDown } = useDisplay()
const { getEthereumTokenByContract, loading: loadingCoinData } = useCoinData()

const MAX_ITEMS = 10

const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    },
    newErc20Transfer: Number
})

const emit = defineEmits<{
    (e: 'resetCount', eventType: AddressEventType, isReset: boolean): void
}>()

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: false | TokenMarketData
    sortKey: string
    sortDirection: string
    index: number
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: false,
    sortKey: TOKEN_FILTER_VALUES[4],
    sortDirection: 'high',
    index: 0
})

const { erc20Tokens, loadingTokens, refetchTokens, tokenSort, tokenBalance, initialLoad } = useAddressToken(props.addressHash)

const hasTokens = computed<boolean>(() => {
    return !!erc20Tokens.value
})

const sortTable = (key: string): void => {
    state.sortDirection = state.sortDirection === 'high' ? 'low' : 'high'
    state.sortKey = `${key}_${state.sortDirection}`
}

const tokens = computed(() => {
    const start = MAX_ITEMS * state.index
    if (!loadingTokens.value && hasTokens.value && tokenSort.value) {
        const end = start + MAX_ITEMS > erc20Tokens.value?.length ? erc20Tokens.value?.length : start + MAX_ITEMS
        return tokenSort.value?.getSortedTokens(state.sortKey)
    }
    return []
})

const totalPages = computed<number>(() => {
    return Math.ceil(new BN(erc20Tokens.value?.length).div(MAX_ITEMS).toNumber())
})

const priceChangeFormatted = (token: Token): string => {
    return token.price_change_percentage_24h ? `${formatPercentageValue(new BN(token.price_change_percentage_24h)).value} %` : ''
}

const change = (token: Token): number => {
    if (!token.price_change_percentage_24h || token.price_change_percentage_24h === 0) {
        return 0
    } else if (token.price_change_percentage_24h > 0) {
        return 1
    }
    return -1
}

const priceChangeClass = (token: Token): string => {
    console.log('here')
    if (change(token) === 0) {
        return 'text-black'
    } else if (change(token) > 0) {
        return 'text-success'
    }
    return 'text-error'
}

const showTokenDetails = (contract: string) => {
    if (state.activeToken?.contract === contract) {
        state.showMoreTokenDetails = false
        return
    }
    state.showMoreTokenDetails = true
    state.activeToken = getEthereumTokenByContract(contract)
}

const setPage = (page: number, reset = false): void => {
    if (reset) {
        refetchTokens()
        emit('resetCount', AddressEventType.NewErc20Transfer, true)
    }
    state.index = page
}

const router = useRouter()
const goToTokensBalancePage = async () => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_TOKENS.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_TOKENS[0] }
    })
}
</script>
