<template>
    <v-app class="app-view">
        <the-app-navigation-drawer-vue />
        <the-app-header />
        <v-main :class="{ 'mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto': !isAddressView }">
            <v-container :class="[isAddressView ? 'pa-0' : 'px-0 pt-4 pt-sm-6']" :fluid="isAddressView">
                <app-btn @click="toggleTheme" text="toggle theme"></app-btn>
                <router-view />
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
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAME } from '@core/router/routesNames'

const store = useStore()

const { result: coinData, loading: loadingCoinData, onResult } = useGetLatestPricesQuery({ pollInterval: 30000 })
store.loadingCoinData = loadingCoinData.value

onResult(() => {
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
</script>
<style lang="scss">
.app-view {
    min-width: 320px;
}
</style>
