<template>
    <v-app class="app-view">
        <the-app-navigation-drawer-vue />
        <the-app-header />
        <v-main class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="core-container px-0 pt-8">
                <v-btn @click="toggleTheme" class="mb-6">toggle theme</v-btn>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import TheAppHeader from './core/components/TheAppHeader.vue'
import TheAppNavigationDrawerVue from './core/components/TheAppNavigationDrawer.vue'
import { useStore } from '@/store'
import { useGetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useTheme } from 'vuetify'

const store = useStore()

store.loadingCoinData = true
const { result: coinData, loading: loadingCoinData, onResult } = useGetLatestPricesQuery({ pollInterval: 300000 })
onResult(() => {
    store.coinData = coinData.value
    store.loadingCoinData = loadingCoinData.value
})
const theme = useTheme()

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'mainnetLightTheme' : 'mainnetDarkTheme'
}
</script>
<style lang="scss">
.app-view {
    min-width: 320px;
}
.core-container {
    @media (min-width: 960px) {
        width: 856px !important;
    }
    @media (min-width: 1240px) {
        width: 100% !important;
    }
    @media (min-width: 1439px) {
        width: 1390px !important;
    }
}
</style>
