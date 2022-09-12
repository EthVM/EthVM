<template>
    <v-card>
        <v-card-title class="justify-space-between">
            <div>
                HRC20 token balance
                <app-new-update text="Token's Balance Changed, Refresh" :update-count="props.newErc20Transfer" hide-count @reload="setPage(0, true)" />
            </div>
            <app-paginate v-if="!initialLoad" :total="totalPages" :current-page="state.index" @newPage="setPage" />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0 bg-primary">
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
            </v-row>
            <v-divider />
            <template v-if="loadingTokens">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </div>
            </template>
            <template v-else>
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
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, Token } from '@module/address/models/TokenSort'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { AddressEventType } from '@/apollo/types'
const { getEthereumTokenByContract } = useCoinData()
const MAX_ITEMS = 10

const props = defineProps({
    addressHash: {
        type: String,
        required: true
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
    sortKey: TOKEN_FILTER_VALUES[1],
    sortDirection: 'high',
    index: 0
})

const { erc20Tokens, loadingTokens, refetchTokens, tokenSort, initialLoad } = useAddressToken(props.addressHash)

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
        return tokenSort.value?.getSortedTokens(state.sortKey).slice(start, end)
    }
    return []
})

const totalPages = computed<number>(() => {
    return Math.ceil(new BN(erc20Tokens.value?.length).div(MAX_ITEMS).toNumber())
})

const priceChangeFormatted = (token: Token): FormattedNumber | null => {
    return token.price_change_percentage_24h ? formatPercentageValue(new BN(token.price_change_percentage_24h)) : null
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
    if (change(token) === 0) {
        return 'text-black'
    } else if (change(token) > 0) {
        return 'text-green'
    }
    return 'text-red'
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
</script>
