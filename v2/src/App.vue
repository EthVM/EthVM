<template>
    <v-app class="app-view">
        <the-app-navigation-drawer-vue />
        <the-app-header :hide-search-bar="isHomeView" />

        <v-main class="w-100">
            <v-container :class="[isAddressView || isHomeView ? 'pa-0' : 'px-2 px-sm-6 pt-4 pt-sm-6']" :fluid="isAddressView || isHomeView">
                <router-view />
                <app-btn @click="toggleTheme" text="toggle theme"></app-btn>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import AppBtn from './core/components/AppBtn.vue'
import TheAppHeader from './core/components/TheAppHeader.vue'
import TheAppNavigationDrawerVue from './core/components/TheAppNavigationDrawer.vue'
import { useStore } from '@/store'
import { useGetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useSetPortfolio } from './core/composables/Portfolio/useSetPortfolioBalance'
import { useTheme } from 'vuetify'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAME } from '@core/router/routesNames'

const store = useStore()

const { result: coinData, loading: loadingCoinData, onResult: onCoinDataResult } = useGetLatestPricesQuery({ pollInterval: 300000 })
store.loadingCoinData = loadingCoinData.value

onCoinDataResult(() => {
    store.coinData = coinData.value
    store.loadingCoinData = false
})

const theme = useTheme()

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'mainnetLightTheme' : 'mainnetDarkTheme'
}

const route = useRoute()
/**
 * Checks if Address View Only
 * Remove all paddings/margins and sets container to fluid
 * This is done to accomodate addree view ui
 * Address view must control breakpoints
 */
const isAddressView = computed<boolean>(() => {
    return (
        route.name === ROUTE_NAME.ADDRESS.NAME ||
        route.name === ROUTE_NAME.ADDRESS_BALANCE.NAME ||
        route.name === ROUTE_NAME.ADDRESS_NFTS.NAME ||
        route.name === ROUTE_NAME.ADDRESS_TOKENS.NAME ||
        route.name === ROUTE_NAME.ADDRESS_CONTRACT.NAME ||
        route.name === ROUTE_NAME.ADDRESS_MINER.NAME
    )
})

const isHomeView = computed<boolean>(() => {
    return route.name === ROUTE_NAME.HOME.NAME
})

/**
 * Fetches eth balances for for the addresses in the portfolio
 * Must be executed after the coin data has been loaded
 */
const fetchAddress = ref('')
const { refetchEthBalance } = useSetPortfolio(fetchAddress)

store.portfolio.forEach(item => {
    useSetPortfolio(item.hash)
})

watch(
    () => store.portfolioLength,
    () => {
        store.portfolio.forEach(item => {
            if (!store.addressEthBalanceLoaded(item.hash.toLocaleLowerCase())) {
                fetchAddress.value = item.hash
            }
        })
    }
)
</script>
<style lang="scss">
.app-view {
    min-width: 320px;
}
</style>
