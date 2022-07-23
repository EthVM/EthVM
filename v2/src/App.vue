<template>
    <v-app class="app-view">
        <the-app-navigation-drawer-vue />
        <the-app-header />
        <v-main class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="px-0 pt-8 core-container" :fluid="isFluidView">
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
import { useAppIsFluid } from '@/core/composables/AppIsFluid/useAppIsFluid.composable'
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

const { isFluidView } = useAppIsFluid()
</script>
<style lang="scss">
.app-view {
    min-width: 320px;
}
</style>
