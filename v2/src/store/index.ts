import BN from 'bignumber.js'
import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useStorage, RemovableRef } from '@vueuse/core'
import { TokenOwnersFragment } from '@module/address/apollo/AddressTokens/tokens.generated'

interface PortfolioItem {
    hash: string
    name: string
}

interface PortfolioEthBalanceMap {
    [key: string]: {
        weiBalance: string
        balanceFormatted: string
        balanceFiatBN: BN
        balanceFiatFormatted: string
    }
}
interface PortfolioTokenBalanceMap {
    [key: string]: {
        balanceFiatBN: BN
        tokens: Array<TokenOwnersFragment | null>
    }
}

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
    favTokens: RemovableRef<string[]>
    portfolio: RemovableRef<PortfolioItem[]>
    portfolioEthBalanceMap: PortfolioEthBalanceMap
    portfolioTokenBalanceMap: PortfolioTokenBalanceMap
}

export const useStore = defineStore('main', {
    state: (): StoreState => ({
        coinData: <GetLatestPricesQuery>{},
        loadingCoinData: false,
        appDrawer: false,
        favTokens: useStorage('favTokens', [] as string[]),
        portfolio: useStorage('portfolio', [] as PortfolioItem[]),
        portfolioEthBalanceMap: {},
        portfolioTokenBalanceMap: {}
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
        },
        addressEthBalanceLoaded: state => {
            return (_hash: string): boolean => {
                return `${_hash.toLowerCase()}` in state.portfolioEthBalanceMap
            }
        },
        addressERC20BalanceLoaded: state => {
            return (_hash: string): boolean => {
                return `${_hash.toLowerCase()}` in state.portfolioTokenBalanceMap
            }
        },
        /**
         * Returns whether or not a token is saved to local storage
         * @returns boolean
         */
        portfolioLength: state => {
            return state.portfolio.length
        },
        addressTotalBalance(state) {
            return (_hash: string): BN | undefined => {
                if (this.addressEthBalanceLoaded(_hash) && this.addressERC20BalanceLoaded(_hash)) {
                    const eth = state.portfolioEthBalanceMap[_hash].balanceFiatBN
                    const tokens = state.portfolioTokenBalanceMap[_hash].balanceFiatBN
                    return eth.plus(tokens)
                }
                return undefined
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
        },
        changeAddressName(_hash: string, _name: string) {
            const item = this.portfolio.find(i => i.hash === _hash)
            if (item) {
                item.name = _name
            }
        },
        addEthBalance(_hash: string, _weiBalance: string, _balanceFormatted: string, _balanceFiatBN: BN, _balanceFiatFormatted: string) {
            this.portfolioEthBalanceMap = Object.assign(this.portfolioEthBalanceMap, {
                [_hash.toLowerCase()]: {
                    weiBalance: _weiBalance,
                    balanceFormatted: _balanceFormatted,
                    balanceFiatBN: _balanceFiatBN,
                    balanceFiatFormatted: _balanceFiatFormatted
                }
            })
        },
        addErc20Balance(_hash: string, _balanceFiatBN: BN, _tokens: Array<TokenOwnersFragment | null>) {
            this.portfolioTokenBalanceMap = Object.assign(this.portfolioTokenBalanceMap, {
                [_hash.toLowerCase()]: {
                    balanceFiatBN: _balanceFiatBN,
                    tokens: _tokens
                }
            })
        }
    }
})
