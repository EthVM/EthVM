<template>
    <v-card variant="elevated" elevation="1" rounded="xl" :class="['pa-4 pa-sm-6 h-100']">
        <v-card-title :class="['pa-0', { 'd-flex align-center justify-space-between mb-2 mb-sm-4': isHomePage }]">
            <h1 :class="[isHomePage ? 'text-h6' : 'text-h4', 'font-weight-bold']">
                {{ title }}
            </h1>
            <app-btn v-if="isHomePage && !xs" :text="$t('common.more')" isSmall icon="east" @click="goToTokens"></app-btn>
            <app-btn-icon v-else-if="isHomePage && xs" icon="east" @click="goToTokens"></app-btn-icon>
        </v-card-title>
        <app-tabs
            v-if="!isHomePage && supportsFiat"
            v-model="state.activeList"
            :routes="routes"
            :tabs="list"
            class="my-5"
            btn-variant
            @update:modelValue="changeRoute"
        ></app-tabs>
        <v-row v-if="!isHomePage" class="mb-10 flex-nowrap" align="center">
            <app-input :place-holder="t('token.searchTokens')" v-model="state.tokenSearch" class="w-100 mr-5" />
            <module-add-fav-token v-if="state.activeList === list[1].value" />
        </v-row>
        <v-row align="center" justify="start" class="text-body-1 text-info my-0 d-none d-sm-flex">
            <v-col sm="6" :md="isHomePage ? '6' : '4'" class="py-0">
                <v-row align="center" class="ma-0">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                        {{ $t('common.token', 1) }}<v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-row>
            </v-col>
            <v-col sm="2" md="2" class="py-0">
                <v-row align="center" class="ma-0">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PRICE)">
                        {{ $t('common.price') }}
                        <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-row>
            </v-col>
            <v-col sm="2" md="2" class="py-0">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PERCENTAGE_CHANGE)">
                    {{ $t('common.24h') }}<v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                ></v-col
            >
            <v-col v-if="!isHomePage" md="2" class="d-none d-md-block py-0">
                <v-row align="center" class="ma-0">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.VOLUME)">
                        {{ $t('market.volume') }}
                        <v-icon v-if="isActiveSort(SORT_KEY.VOLUME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-row>
            </v-col>
            <v-col :sm="2" class="d-none d-sm-block py-0">
                <v-row align="center" class="ma-0">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.MARKET_CAP)">
                        {{ $t('market.marketCapShort') }}
                        <v-icon v-if="isActiveSort(SORT_KEY.MARKET_CAP)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-row>
            </v-col>
        </v-row>
        <!--
            Mobile Sort:
            XS: on the right end
            SM: none
        -->
        <v-row v-if="xs && !isHomePage" align="center" justify="start" class="mb-0" dense>
            <v-spacer />
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
                    <v-list-item :title="$t('common.price')" class="py-2" @click="sortTable(SORT_KEY.PRICE)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('market.volume')" class="py-2" @click="sortTable(SORT_KEY.VOLUME)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.VOLUME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></template
                        >
                    </v-list-item>
                    <v-list-item :title="$t('market.marketCap')" class="py-2" @click="sortTable(SORT_KEY.MARKET_CAP)">
                        <template #append>
                            <v-icon v-if="isActiveSort(SORT_KEY.MARKET_CAP)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
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
        <v-divider class="my-0 mt-sm-3 mx-n4 mx-sm-n6" />
        <template v-if="!loadingCoinData">
            <div v-if="tokensInPage.length > 0" class="p-ten-top">
                <div v-for="token in currentPageData" :key="token.contract">
                    <token-market-info-table-row v-if="token" :token="token" :is-home-view="isHomePage" />
                </div>
            </div>
            <div v-else>
                <app-no-result text="No results found. Please try again" class="mt-6"></app-no-result>
            </div>
        </template>
        <template v-else>
            <div v-for="item in showLoadingRows" :key="item" style="padding: 10px 0">
                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
            </div>
        </template>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppTabs from '@core/components/AppTabs.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppInput from '@core/components/AppInput.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import AppPagination from '@core/components/AppPagination.vue'
import AppMenu from '@core/components/AppMenu.vue'
import { Tab } from '@/core/components/props'
import TokenMarketInfoTableRow from '@module/tokens/components/token-market-info/TableRowTokenMarketInfo.vue'
import ModuleAddFavToken from './ModuleAddFavToken.vue'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { TOKEN_FILTER_VALUES, KEY, DIRECTION, TokenSortMarket, TokenMarket } from '@module/address/models/TokenSort'
import { ROUTE_NAME, Q_TOKENS } from '@core/router/routesNames'
import { searchHelper } from '@core/helper/search'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { TOKENS_VIEW } from './models/tokensView'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useNetwork } from '@/core/composables/Network/useNetwork'

const { t } = useI18n()

const { xs } = useDisplay()
const { supportsFiat } = useNetwork()
const routes = Q_TOKENS
// const MAX_TOKENS = 200
const store = useStore()

interface PropType {
    homePage?: TOKENS_VIEW
    tab?: string
}
const props = withDefaults(defineProps<PropType>(), {})
const list: Tab[] = [
    {
        value: routes[1],
        title: t('token.favorites')
    }
]
if (supportsFiat.value) {
    list.unshift({
        value: routes[0],
        title: t('common.all')
    })
}

interface ComponentState {
    index: number
    maxItems: number
    sortKey: string
    sortDirection: string
    tokenSearch: string
    activeList: string
}

const state: ComponentState = reactive({
    index: 0,
    maxItems: 20,
    sortKey: TOKEN_FILTER_VALUES[13],
    sortDirection: DIRECTION.HIGH,
    tokenSearch: '',
    activeList: props.tab || list[0].value
})

const { tokensWithMarketCap, loading: loadingCoinData, getEthereumTokenByContract } = useCoinData()

const isHomePage = computed<boolean>(() => {
    return !!props.homePage
})

const tokens = computed<TokenSortMarket | null>(() => {
    if (!store.loadingCoinData && tokensWithMarketCap) {
        const filtered = tokensWithMarketCap.value.filter((x): x is TokenMarketData => x !== null)
        let all = filtered.map(i => new TokenMarket(i))
        if (state.tokenSearch) {
            all = searchHelper(all, ['name', 'symbol', 'contract'], state.tokenSearch) as Array<TokenMarket>
        }
        const max = isHomePage.value ? 7 : 500
        const topTokens = new TokenSortMarket(all).getSortedTokens(TOKEN_FILTER_VALUES[13]).splice(0, max)
        return new TokenSortMarket(topTokens)
    }
    return null
})

const favTokensSorted = computed<TokenSortMarket | null>(() => {
    if (!store.loadingCoinData) {
        let favs: TokenMarket[] = []
        store.favTokens.forEach(fav => {
            const market = getEthereumTokenByContract(fav) || undefined
            favs.push(new TokenMarket(market))
        })
        if (state.tokenSearch) {
            favs = searchHelper(favs, ['name', 'symbol', 'contract'], state.tokenSearch) as Array<TokenMarket>
        }
        const max = isHomePage.value ? 7 : store.favTokens.length
        const favTokens = new TokenSortMarket(favs).getSortedTokens(TOKEN_FILTER_VALUES[13]).splice(0, max)
        return new TokenSortMarket(favTokens)
    }
    return null
})

const tokensInPage = computed<TokenMarket[]>(() => {
    if (!store.loadingCoinData && tokens.value && favTokensSorted.value) {
        const showAll = !isHomePage.value ? state.activeList === list[0].value : props.homePage === TOKENS_VIEW.ALL
        const viewable = showAll ? tokens.value : favTokensSorted.value
        return viewable.getSortedTokens(state.sortKey)
    }
    return []
})

const tabId = computed<string>(() => {
    return state.activeList === 'all' ? 'tabAllTokens' : 'tabFavoriteTokens'
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(tokensInPage, tabId, 50)

const showPagination = computed<boolean>(() => {
    return !store.loadingCoinData && tokensInPage.value.length > 0 && !isHomePage.value
})

/**------------------------
 * Table Sorting
 -------------------------*/

const sortIcon = computed<string>(() => {
    return state.sortDirection === DIRECTION.HIGH ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}

const SORT_KEY = KEY

const activeSortString = computed<string>(() => {
    if (state.sortKey.includes(SORT_KEY.MARKET_CAP)) {
        return t('market.marketCap')
    } else if (state.sortKey.includes(SORT_KEY.PRICE)) {
        return t('common.price')
    } else if (state.sortKey.includes(SORT_KEY.NAME)) {
        return t('common.token')
    } else if (state.sortKey.includes(SORT_KEY.VOLUME)) {
        return t('market.volume')
    }
    return t('common.24h')
})

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 */
const loadMoreData = (page: number): void => {
    setPageNum(page)
}

const sortTable = (key: KEY): void => {
    state.sortDirection = state.sortDirection === DIRECTION.HIGH ? DIRECTION.LOW : DIRECTION.HIGH
    state.sortKey = `${key}_${state.sortDirection}`
}

/** -------------------
 * Handle View: home page / default
 ---------------------*/
const showLoadingRows = computed<number>(() => {
    return isHomePage.value ? 7 : 10
})

const title = computed<string>(() => {
    return props.homePage === TOKENS_VIEW.ALL
        ? t('block.topTokenTitle')
        : props.homePage === TOKENS_VIEW.FAV || !supportsFiat.value
        ? t('block.favoriteTokenTitle')
        : t('block.marketTokenTitle')
})

const router = useRouter()
const goToTokens = async (): Promise<void> => {
    const _tab = props.homePage === TOKENS_VIEW.FAV || !supportsFiat.value ? Q_TOKENS[1] : Q_TOKENS[0]
    await router.push({
        name: ROUTE_NAME.TOKENS.NAME,
        query: {
            t: _tab
        }
    })
}

/**------------------------
 * Tab Change
 -------------------------*/

const route = useRoute()

const changeRoute = () => {
    if (route.query.t !== state.activeList) {
        router.push({
            query: { t: state.activeList }
        })
    }
}
</script>

<style scoped lang="scss">
.sort-button {
    opacity: 0;
    &:hover:not(.sort--active) {
        opacity: 0.5;
    }

    &--active {
        opacity: 1;
    }
}
</style>
