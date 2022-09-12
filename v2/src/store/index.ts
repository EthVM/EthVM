import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
}

export const useStore = defineStore('main', {
    state: (): StoreState => {
        return {
            coinData: <GetLatestPricesQuery>{},
            loadingCoinData: false,
            appDrawer: false
        }
    }
})
