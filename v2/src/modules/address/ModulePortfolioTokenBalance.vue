<template>
    <div class="px-4 px-sm-6 pb-4 pb-sm-6">
        <v-row justify="start" aligned="center" dense>
            <v-col v-for="(i, index) in state.filterList" :key="index" class="flex-shrink-1 flex-grow-0">
                <v-btn
                    color="textPrimary"
                    :variant="i.isSelected ? 'flat' : 'outlined'"
                    density="compact"
                    rounded="pill"
                    :class="index === 0 ? 'px-1' : 'px-2'"
                    height="24"
                    @click="setFilter(index)"
                >
                    <div class="d-flex align-center">
                        <app-address-blockie v-if="index !== 0" :address="i.hash" :size="4" class="mr-2" />
                        <p class="text-ellipses" style="max-width: 260px">{{ i.name }}</p>
                    </div></v-btn
                >
            </v-col>
            <v-col cols="12">
                <app-input :place-holder="$t('token.searchTokenName')" v-model="state.searchParams" class="mt-5" />
            </v-col>
        </v-row>

        <!--Table Header-->
        <v-row :dense="xs" class="mt-4 d-flex text-body-1 text-info mb-0" :justify="xs ? 'end' : 'start'">
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
            <v-col sm="4" :lg="3" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                    {{ $t('common.token') }}
                    <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
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
            <v-col cols="12" sm="8" lg="9" class="d-none d-sm-flex">
                <v-row>
                    <!--PRICE -->
                    <v-col sm="4" lg="3" class="py-0 text-right text-sm-left">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PRICE)">
                            {{ $t('common.price') }}
                            <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
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
                            {{ $t('common.24h') }}<v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" lg="3" class="py-0 d-none d-sm-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.USD)">
                            {{ $t('common.usdValue') }}
                            <v-icon v-if="isActiveSort(SORT_KEY.USD)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" lg="3" class="py-0 d-none d-sm-flex justify-space-between">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.BALANCE)">
                            {{ $t('common.balance') }}
                            <v-icon v-if="isActiveSort(SORT_KEY.BALANCE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-col>
                </v-row>
            </v-col>
            <v-spacer class="d-flex d-sm-none" />
            <!--
               Mobile Sort:
                XS: on the right end
                SM: none
             -->
            <v-col class="d-flex d-sm-none justify-end">
                <v-btn variant="text" color="info" class="font-weight-regular mr-n3 d-block" rounded="pill" size="small" id="activator-mobile-sort">
                    {{ activeSortString }}
                    <v-icon class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
                <app-menu min-width="140" activator="#activator-mobile-sort" :close-on-content-click="false">
                    <v-list-item :title="$t('portfolio.tokenName')" class="py-2" @click="sortTable(SORT_KEY.NAME)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.usdValue')" class="py-2" @click="sortTable(SORT_KEY.USD)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.USD)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.balance')" class="py-2" @click="sortTable(SORT_KEY.BALANCE)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.BALANCE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></template
                        >
                    </v-list-item>
                    <v-list-item :title="$t('common.price')" class="py-2" @click="sortTable(SORT_KEY.PRICE)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.24h')" class="py-2" @click="sortTable(SORT_KEY.PERCENTAGE_CHANGE)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></template
                        >
                    </v-list-item>
                </app-menu>
            </v-col>
        </v-row>

        <v-divider class="mx-n4 mx-sm-n6 mt-sm-3" />
        <!--Loading -->
        <v-row v-if="!store.portfolioIsLoaded" class="mt-5">
            <v-col v-for="col in 7" :key="col" cols="12" class="pb-5 pt-0">
                <div class="skeleton-box rounded-xl" style="min-height: 44px"></div>
            </v-col>
        </v-row>
        <!--Token Row -->
        <div v-else class="mx-n4 mx-sm-n6 px-4 px-sm-6 p-ten-top">
            <div v-if="tokens.length > 0">
                <div v-for="token in currentPageData" :key="token.contract">
                    <table-row-token-balance :token="token" :is-overview="false" :is-active="false"> </table-row-token-balance>
                </div>
            </div>
            <app-no-result v-else :text="messageNoTokens" class="mt-3 mt-sm-1"></app-no-result>
        </div>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </div>
</template>

<script setup lang="ts">
import AppInput from '@core/components/AppInput.vue'
import AppMenu from '@core/components/AppMenu.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import TableRowTokenBalance from './components/TableRowTokenBalance.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed, reactive, watch } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, KEY, DIRECTION, Token } from '@module/address/models/TokenSort'
import AppNoResult from '@/core/components/AppNoResult.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { searchHelper } from '@core/helper/search'
import { useStore } from '@/store'
import { TokenSort } from '@module/address/models/TokenSort'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'

const { xs } = useDisplay()
const { loading: loadingCoinData, getEthereumTokensMap } = useCoinData()
const store = useStore()

interface PropType {
    addressRef?: string
}

const props = defineProps<PropType>()

interface Filter {
    hash: string
    isSelected: boolean
    name: string
}

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: string
    sortKey: string
    sortDirection: string
    index: number
    searchParams: string
    filterList: Filter[]
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: '',
    sortKey: TOKEN_FILTER_VALUES[5],
    sortDirection: 'high',
    index: 0,
    searchParams: '',
    filterList: [
        {
            hash: 'all',
            isSelected: true,
            name: 'All'
        }
    ]
})

/**------------------------
 * Table Filter
 -------------------------*/

const messageNoTokens = computed<string>(() => {
    return state.searchParams === '' ? 'This portfolio does not have any tokens' : 'Selected addresses do not own this token'
})

store.portfolio.forEach(i => {
    const isSelected = props.addressRef?.toLowerCase() === i.hash.toLowerCase()
    if (isSelected) {
        state.filterList[0].isSelected = false
    }
    state.filterList.push({
        hash: i.hash,
        isSelected: isSelected,
        name: i.name
    })
})
const setFilter = (index: number) => {
    if (index === 0) {
        state.filterList.forEach(i => (i.isSelected = false))
    } else {
        state.filterList[0].isSelected = false
    }
    if (state.filterList[index].isSelected) {
        const selected = state.filterList.filter(i => i.isSelected && i.hash != state.filterList[index].hash)
        if (selected.length > 0) {
            state.filterList[index].isSelected = false
        }
    } else {
        state.filterList[index].isSelected = true
    }

    // reset pagination
    setPageNum(1)
}
const activeFilter = computed<string[] | undefined>(() => {
    if (state.filterList[0].isSelected) {
        return undefined
    }
    return state.filterList.filter(i => i.isSelected === true).map(i => i.hash)
})

watch(
    () => store.portfolioLength,
    (newLength, oldLength) => {
        if (newLength > oldLength) {
            //Added New Address
            const newItem = store.portfolio[oldLength]
            state.filterList.push({
                hash: newItem.hash,
                isSelected: false,
                name: newItem.name
            })
        } else {
            //Deleted an Address
            const deleted = state.filterList.findIndex((i, index) => {
                if (index === 0) {
                    return false
                }
                const exists = store.portfolio.findIndex(el => el.hash === i.hash)
                return exists < 0
            })
            if (deleted > -1) {
                state.filterList.splice(deleted, 1)
                const selected = state.filterList.filter(i => i.isSelected)
                if (selected.length === 0) {
                    setFilter(0)
                }
            }
        }
    }
)

/**------------------------
 * Tokens Data
 -------------------------*/
const tokenPrices = computed<Map<string, TokenMarketData> | false | null>(() => {
    if (store.portfolioIsLoaded && !loadingCoinData.value) {
        const contracts: string[] = []
        store.portfolioTokensRaw().forEach(token => {
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
const tokensLength = computed<number>(() => {
    return store.portfolioTokensRaw().length
})
const hasTokens = computed<boolean>(() => {
    return tokensLength.value > 0
})

const tokenSort = computed(() => {
    if (store.portfolioIsLoaded && tokenPrices.value !== null) {
        return new TokenSort(store.portfolioTokensRaw(activeFilter.value), tokenPrices.value, true)
    }
    return false
})

const tokens = computed<Token[]>(() => {
    let _tokens: Token[] = []
    if (store.portfolioIsLoaded && hasTokens.value && tokenSort.value) {
        const tokenSorted = tokenSort.value?.getSortedTokens(state.sortKey)
        if (state.searchParams !== '') {
            _tokens = searchHelper(tokenSorted, ['name', 'symbol', 'contract'], state.searchParams) as Token[]
        } else {
            _tokens = tokenSorted
        }
    }
    return _tokens
})

/**------------------------
 * Pagination
 -------------------------*/

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(tokens, 'tabPortfolioBalances')

const showPagination = computed<boolean>(() => {
    return store.portfolioIsLoaded && !!tokens.value && tokens.value.length > 0
})

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
}

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

const activeSortString = computed<string>(() => {
    if (state.sortKey.includes(SORT_KEY.BALANCE)) {
        return 'Balance'
    } else if (state.sortKey.includes(SORT_KEY.PRICE)) {
        return 'Price'
    } else if (state.sortKey.includes(SORT_KEY.NAME)) {
        return 'Token'
    } else if (state.sortKey.includes(SORT_KEY.USD)) {
        return 'USD Value'
    }
    return '24h'
})
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
