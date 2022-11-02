<template>
    <div class="pa-4 pa-sm-6">
        <div class="d-flex align-center">
            <div class="flex-grow-1">
                <app-input place-holder="Search token name" v-model="state.searchParams" />
            </div>
        </div>

        <!--Table Header-->
        <v-row :dense="xs" class="mt-sm-4 d-flex text-body-1 text-info mb-sm-3" :justify="xs ? 'end' : 'start'">
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
            <v-col sm="4" :lg="2" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                    Token <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                Symbol on Overview:
                XS and UP: NONE
                ------------
                Symbol
                XS: NONE
                LG: 1
             -->
            <v-col sm="1" class="py-0 d-none d-lg-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.SYMBOL)">
                    Symbol <v-icon v-if="isActiveSort(SORT_KEY.SYMBOL)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                ></v-col
            >
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
                    <!--PRICE -->
                    <v-col sm="4" lg="3" class="py-0 text-right text-sm-left">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PRICE)">
                            Price <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col lg="3" class="py-0 d-none d-lg-block">
                        <v-btn
                            variant="text"
                            color="info"
                            class="font-weight-regular ml-n3"
                            rounded="pill"
                            size="small"
                            @click="sortTable(SORT_KEY.PERCENTAGE_CHANGE)"
                        >
                            24h<v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" lg="3" class="py-0 d-none d-sm-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.USD)">
                            USD Value <v-icon v-if="isActiveSort(SORT_KEY.USD)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" lg="3" class="py-0 d-none d-sm-flex justify-space-between">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.BALANCE)">
                            Balance <v-icon v-if="isActiveSort(SORT_KEY.BALANCE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                        <p class="text-right">More</p>
                    </v-col>
                </v-row>
            </v-col>
            <v-spacer class="d-flex d-sm-none" />
            <v-col class="d-flex d-sm-none justify-end">
                <v-btn variant="text" color="info" class="font-weight-regular mr-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.USD)">
                    USD Value <v-icon v-if="isActiveSort(SORT_KEY.USD)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
        </v-row>

        <v-divider class="mx-n4 mx-sm-n6 mb-1 mb-sm-5" />
        <!--Loading -->
        <v-row v-if="!store.portfolioIsLoaded">
            <v-col v-for="col in 7" :key="col" cols="12" class="my-1">
                <div class="skeleton-box rounded-xl" style="min-height: 44px"></div>
            </v-col>
        </v-row>
        <!--Token Row -->
        <div v-else-if="renderState.renderTable" class="mx-n4 mx-sm-n6 px-4 px-sm-6 mt-2">
            <div v-if="tokensLength > 0">
                <div v-for="token in tokens" :key="token.contract">
                    <table-row-token-balance :token="token" :is-overview="false" :is-active="false"> </table-row-token-balance>
                </div>
            </div>
            <app-no-result v-else text="This address does not hold any tokens" class="mt-3 mt-sm-1"></app-no-result>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, onBeforeUnmount, toRefs, watch } from 'vue'
import AppInput from '@core/components/AppInput.vue'
import AppBtn from '@/core/components/AppBtn.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import TableRowTokenBalance from './components/TableRowTokenBalance.vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, KEY, DIRECTION, Token, TokenSortMarket, TokenMarket } from '@module/address/models/TokenSort'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAppTableRowRender } from '@core/composables/AppTableRowRender/useAppTableRowRender.composable'
import { searchHelper } from '@core/helper/search'
import { useStore } from '@/store'
import { TokenOwnersFragment } from '@module/address/apollo/AddressTokens/tokens.generated'
import { TokenSort } from '@module/address/models/TokenSort'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import Web3Utils from 'web3-utils'

const { xs } = useDisplay()
const { loading: loadingCoinData, getEthereumTokensMap } = useCoinData()
const store = useStore()
interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: string
    sortKey: string
    sortDirection: string
    index: number
    searchParams: string
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: '',
    sortKey: TOKEN_FILTER_VALUES[5],
    sortDirection: 'high',
    index: 0,
    searchParams: ''
})
/**------------------------
 * Tokens Data
 -------------------------*/
const tokenPrices = computed<Map<string, TokenMarketData> | false | null>(() => {
    if (store.portfolioIsLoaded && !loadingCoinData.value) {
        const contracts: string[] = []
        tokensRaw.value.forEach(token => {
            if (token) {
                contracts.push(token.tokenInfo.contract)
            }
        })
        if (contracts.length > 0) {
            return getEthereumTokensMap(contracts)
        }
    }
    return null
})
const tokensRaw = computed(() => {
    const allTokens: TokenOwnersFragment[] = []
    if (store.portfolioIsLoaded) {
        const adrs = store.portfolio.map(i => i.hash.toLocaleLowerCase())
        adrs.forEach(i => {
            const filtered = store.portfolioTokenBalanceMap[i].tokens.filter((x): x is TokenOwnersFragment => x !== null)
            filtered.forEach(_token => {
                const index = allTokens.findIndex(item => _token.tokenInfo.contract === item.tokenInfo.contract)
                if (index < 0) {
                    allTokens.push(_token)
                    return
                }
                const balanceInToken = Web3Utils.toBN(_token.balance)
                const balanceInAll = Web3Utils.toBN(allTokens[index].balance)
                const newBalance = balanceInAll.add(balanceInToken)
                const newItem = {
                    ..._token,
                    balance: Web3Utils.toHex(newBalance)
                }
                allTokens.splice(index, 1, newItem)
            })
        })
    }
    return allTokens
})
const hasTokens = computed<boolean>(() => {
    return tokensRaw.value.length > 0
})

const tokensLength = computed<number>(() => {
    return tokensRaw.value.length
})
const { renderState } = useAppTableRowRender(tokensLength.value)

const tokenSort = computed(() => {
    if (store.portfolioIsLoaded && tokenPrices.value !== null) {
        return new TokenSort(tokensRaw.value, tokenPrices.value, true)
    }
    return false
})

const tokens = computed<Token[]>(() => {
    let _tokens: Token[] = []
    if (store.portfolioIsLoaded && hasTokens.value && tokenSort.value) {
        const tokenSorted = tokenSort.value?.getSortedTokens(state.sortKey)
        if (state.searchParams) {
            _tokens = searchHelper(tokenSorted, ['name', 'symbol', 'contract'], state.searchParams) as Token[]
        } else {
            _tokens = tokenSorted
        }
        return renderState.isActive ? _tokens.slice(0, renderState.maxItems) : _tokens
    }
    return _tokens
})
/**------------------------
 * Table Sorting
 -------------------------*/

const sortTable = (key: KEY): void => {
    state.sortDirection = state.sortDirection === DIRECTION.HIGH ? DIRECTION.LOW : DIRECTION.HIGH
    state.sortKey = `${key}_${state.sortDirection}`
}
const sortIcon = computed<string>(() => {
    return state.sortDirection === DIRECTION.HIGH ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}

const SORT_KEY = KEY

/**------------------------
 * Refetch Tokens
 -------------------------*/
const resetCount = (): void => {
    // refetchTokens()
    // emit('resetCount', AddressEventType.NewErc20Transfer, true)
}

/**------------------------
 * Route Changes
 -------------------------*/
const router = useRouter()
</script>

<style scoped>
.module-body {
    overflow-y: overlay;
    background: transparent;
}
.module-body::-webkit-scrollbar {
    width: 8px;
}
.module-body::-webkit-scrollbar-thumb {
    background-color: rgb(var(--v-theme-loading));
    border: 2px solid rgb(var(--v-theme-loading));
    border-radius: 10rem;
}
.module-body::-webkit-scrollbar-track {
    position: absolute;
    right: -20rem;
    top: -50rem;
    background: transparent;
}
</style>
