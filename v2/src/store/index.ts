import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useStorage, RemovableRef } from '@vueuse/core'

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
    favTokens: RemovableRef<string[]>
}

export const useStore = defineStore('main', {
    state: (): StoreState => ({
        coinData: <GetLatestPricesQuery>{},
        loadingCoinData: false,
        appDrawer: false,
        favTokens: useStorage('favTokens', [] as string[])
    }),
    getters: {
        tokenIsFav: state => {
            return (contract: string): boolean => {
                const exhists = state.favTokens.find(i => i === contract)
                return exhists !== undefined
            }
        }
    },
    actions: {
        addFavToken(contract: string) {
            this.favTokens.push(contract)
        },
        removeFavToken(contract: string) {
            const newList = this.favTokens.filter(i => i !== contract)
            this.favTokens = [...newList]
        }
    }
})
