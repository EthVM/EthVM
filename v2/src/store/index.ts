import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useStorage, RemovableRef } from '@vueuse/core'

interface PortfolioItem {
    hash: string
    name: string
}

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
    favTokens: RemovableRef<string[]>
    portfolio: RemovableRef<PortfolioItem[]>
}

export const useStore = defineStore('main', {
    state: (): StoreState => ({
        coinData: <GetLatestPricesQuery>{},
        loadingCoinData: false,
        appDrawer: false,
        favTokens: useStorage('favTokens', [] as string[]),
        portfolio: useStorage('portfolio', [] as PortfolioItem[])
    }),
    getters: {
        /**
         * Returns whether or not a token is saved to local storage
         * @returns boolean
         */
        tokenIsFav: state => {
            return (contract: string): boolean => {
                const exhists = state.favTokens.find(i => i === contract)
                return exhists !== undefined
            }
        },
        /**
         * Returns whether or not an address can be saved
         * @returns true - if address is saved
         * @returns false - if address is not saved and list <= 10
         * @returns undefined - if potrolio list === 10
         */
        addressHashIsSaved: state => {
            return (_hash: string): boolean | undefined => {
                const exhists = state.portfolio.find(i => i.hash.toLowerCase() === _hash.toLowerCase())
                if (exhists) {
                    return true
                }
                return state.portfolio.length === 10 ? undefined : false
            }
        },
        /**
         * Returns whether or not an address name is saved
         * @returns boolean
         */
        addressNameIsSaved: state => {
            return (_name: string): boolean => {
                const exhists = state.portfolio.find(i => i.name.toLowerCase() === _name.toLowerCase())
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
        },
        addAddress(_hash: string, _name: string) {
            if (this.portfolio.length <= 10) {
                this.portfolio.push({
                    hash: _hash,
                    name: _name
                })
            }
        },
        removeAddress(_hash: string) {
            const newList = this.portfolio.filter(i => i.hash !== _hash)
            this.portfolio = [...newList]
        }
    }
})
