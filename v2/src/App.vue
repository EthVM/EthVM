<template>
    <v-app>
        <the-app-navigation-drawer />
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import TheAppNavigationDrawer from '@core/components/TheAppNavigationDrawer.vue'
import { useStore } from '@/store'
import { useGetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
const store = useStore()

store.loadingCoinData = true
const { result: coinData, loading: loadingCoinData, onResult } = useGetLatestPricesQuery({ pollInterval: 300000 })
onResult(() => {
    store.coinData = coinData.value
    store.loadingCoinData = loadingCoinData.value
})
</script>

<style lang="scss">
.v-application {
    background-color: #f3f4f8;
}
</style>
