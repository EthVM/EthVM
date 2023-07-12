import BN from 'bignumber.js'
import Web3Utils from 'web3-utils'
import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useStorage, RemovableRef } from '@vueuse/core'
import { TokenOwnersFragment } from '@module/address/apollo/AddressTokens/tokens.generated'
import { NotificationType, NotificationDeleteAddress, Notification, MAX_PORTFOLIO_ITEMS, PortfolioItem, PROMOS } from './helpers'
import { i18nGlobal } from '@/translations/index'

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
    notification: NotificationDeleteAddress | Notification | undefined
    adrBook: RemovableRef<PortfolioItem[]>
    paginationStateMap: Map<string, number>
    appTheme: RemovableRef<string>
    currentLargeButtonPromo: string
    dataShare: RemovableRef<boolean>
    lang: RemovableRef<string>
}

const getKeySumBN = <T>(map: Record<string, T>, _key: keyof T): BN => {
    const adrs = Object.keys(map)
    let total = new BN(0)
    adrs.forEach(i => {
        const adr = map[i]
        if (adr) {
            const h = adr[_key]
            if (typeof h === 'string' || BN.isBigNumber(h)) {
                total = total.plus(new BN(h))
            } else {
                throw new Error(
                    'ERROR IN: getKeySumBN() in pinia store. Incorrect type supplied. Please check T[_key] type. Type should be either String or BigNumber.'
                )
            }
        }
    })
    return total
}

export const useStore = defineStore('main', {
    state: (): StoreState => ({
        coinData: <GetLatestPricesQuery>{},
        loadingCoinData: false,
        appDrawer: false,
        favTokens: useStorage('favTokens', [] as string[]),
        portfolio: useStorage('portfolio', [] as PortfolioItem[]),
        portfolioEthBalanceMap: {},
        portfolioTokenBalanceMap: {},
        notification: undefined,
        adrBook: useStorage('addressBook', [] as PortfolioItem[]),
        paginationStateMap: new Map(),
        appTheme: useStorage('app-theme', ''),
        currentLargeButtonPromo: PROMOS.enkrypt,
        dataShare: useStorage('allowDataShare', true),
        lang: useStorage('lang', 'en_US')
    }),
    getters: {
        /**
         * Returns if app using DarkMode
         * @returns boolean
         */
        isDarkMode: state => {
            return state.appTheme === 'mainnetDarkTheme'
        },
        /**
         * Returns whether or not a token is saved to local storage
         * @returns boolean
         */
        tokenIsFav: state => {
            return (contract: string): boolean => {
                const exhists = state.favTokens.find(i => i.toLowerCase() === contract.toLowerCase())
                return exhists !== undefined
            }
        },
        /**
         * Returns whether or not an address can be saved
         * @returns true - if address is saved
         * @returns false - if address is not saved and list <= MAX_PORTFOLIO_ITEMS
         */
        addressHashIsSaved: state => {
            return (_hash: string, isAddressBook = false): boolean => {
                const storeArray = isAddressBook ? state.adrBook : state.portfolio
                const exhists = storeArray.find(i => i.hash.toLowerCase() === _hash.toLowerCase())
                if (exhists) {
                    return true
                }
                return false
            }
        },
        /**
         * Returns whether or not an address name is saved
         * @returns boolean
         */
        addressNameIsSaved: state => {
            return (_name: string): boolean => {
                const storeArray = [...state.portfolio, ...state.adrBook]
                const exhists = storeArray.find(i => i.name && i.name.toLowerCase() === _name.toLowerCase())
                return exhists !== undefined
            }
        },
        getAddressName: state => {
            return (_hash: string): string | undefined => {
                const storeArray = [...state.portfolio, ...state.adrBook]
                const item = storeArray.find(i => i.hash && i.hash.toLowerCase() === _hash.toLowerCase())
                return item ? item.name : undefined
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
        },
        portfolioEthIsLoaded(state) {
            return (): boolean => {
                const isLoaded = state.portfolio.map(i => {
                    return this.addressEthBalanceLoaded(i.hash)
                })
                return !isLoaded.includes(false)
            }
        },
        portfolioTokensIsLoaded(state) {
            return (): boolean => {
                const isLoaded = state.portfolio.map(i => {
                    return this.addressERC20BalanceLoaded(i.hash)
                })
                return !isLoaded.includes(false)
            }
        },
        portfolioIsLoaded: state => {
            const isLoaded = state.portfolio.map(i => {
                return `${i.hash.toLowerCase()}` in state.portfolioEthBalanceMap && `${i.hash.toLowerCase()}` in state.portfolioTokenBalanceMap
            })
            return !isLoaded.includes(false)
        },
        portfolioWeiBalanceBN: state => {
            try {
                return getKeySumBN(state.portfolioEthBalanceMap, 'weiBalance')
            } catch {
                //NOTE: sentry send e
                return new BN(0)
            }
        },
        portfolioEthFiatBN: state => {
            try {
                return getKeySumBN(state.portfolioEthBalanceMap, 'balanceFiatBN')
            } catch {
                //NOTE: sentry send e
                return new BN(0)
            }
        },
        portfolioTokensFiatBN: state => {
            try {
                return getKeySumBN(state.portfolioTokenBalanceMap, 'balanceFiatBN')
            } catch {
                //sentry send e
                return new BN(0)
            }
        },
        addressTokensRaw(state) {
            return (_hash: string): TokenOwnersFragment[] => {
                if (this.addressERC20BalanceLoaded(_hash)) {
                    return state.portfolioTokenBalanceMap[_hash].tokens.filter((x): x is TokenOwnersFragment => x !== null)
                }
                return []
            }
        },
        portfolioTokensRaw(state) {
            return (_adrs: string[] | undefined = undefined) => {
                const allTokens: TokenOwnersFragment[] = []
                if (this.portfolioIsLoaded) {
                    const adrs = _adrs ? _adrs : Object.keys(state.portfolioTokenBalanceMap)
                    adrs.forEach(i => {
                        const _tokens = this.addressTokensRaw(i)
                        _tokens.forEach(_token => {
                            //Check if token balance was loaded
                            const index = allTokens.findIndex(item => _token.tokenInfo.contract === item.tokenInfo.contract)
                            if (index < 0) {
                                allTokens.push(_token)
                                return
                            }
                            const balanceInToken = Web3Utils.toBN(_token.balance)
                            const balanceInAll = Web3Utils.toBN(allTokens[index].balance)
                            const newBalance = balanceInAll.add(balanceInToken)
                            const newItem = {
                                ..._token,
                                balance: Web3Utils.toHex(newBalance)
                            }
                            allTokens.splice(index, 1, newItem)
                        })
                    })
                }
                return allTokens
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
        addAddress(_hash: string, _name: string, isAddressBook = false, notify = true) {
            if (!isAddressBook) {
                if (!this.addressHashIsSaved(_hash) && this.portfolio.length <= MAX_PORTFOLIO_ITEMS) {
                    this.portfolio.push({
                        hash: _hash.toLowerCase(),
                        name: _name
                    })
                    //check if addressbook already has this address
                    if (this.addressHashIsSaved(_hash, true)) {
                        this.removeAddress(_hash, true)
                    }
                    if (notify) {
                        this.addNotification({
                            _type: NotificationType.PLAIN,
                            text: `${i18nGlobal.t('portfolio.nameAdded', { name: _name })}`
                        })
                    }
                }
            } else {
                if (!this.addressHashIsSaved(_hash, true)) {
                    this.adrBook.push({
                        hash: _hash.toLowerCase(),
                        name: _name
                    })
                }
            }
        },
        removeAddress(hash: string, isAddressBook = false) {
            const _hash = hash.toLowerCase()
            if (!isAddressBook) {
                const item = this.portfolio.filter(i => i.hash.toLowerCase() === _hash)
                if (item.length > 0) {
                    this.addNotification({
                        _type: NotificationType.DELETE_ADR,
                        hash: item[0].hash,
                        name: item[0].name
                    })
                    const newList = this.portfolio.filter(i => i.hash.toLowerCase() !== _hash)
                    delete this.portfolioEthBalanceMap[_hash]
                    delete this.portfolioTokenBalanceMap[_hash]
                    this.addAddress(item[0].hash, item[0].name, true)
                    this.portfolio = [...newList]
                }
            } else {
                const newList = this.adrBook.filter(i => i.hash.toLowerCase() !== _hash)
                this.adrBook = [...newList]
            }
        },
        checkBalanceMap() {
            const portfolioKeys = this.portfolio.map(i => i.hash.toLowerCase())
            const ethKeys = Object.keys(this.portfolioEthBalanceMap)
            const tokensKeys = Object.keys(this.portfolioTokenBalanceMap)
            if (ethKeys.length !== portfolioKeys.length) {
                const deleted = ethKeys.filter(hash => !portfolioKeys.includes(hash))
                deleted.forEach(_hash => {
                    delete this.portfolioEthBalanceMap[_hash]
                })
            }
            if (tokensKeys.length !== portfolioKeys.length) {
                const deleted = tokensKeys.filter(hash => !portfolioKeys.includes(hash))
                deleted.forEach(_hash => {
                    delete this.portfolioTokenBalanceMap[_hash]
                })
            }
        },
        changeAddressName(_hash: string, _name: string, isAddressBook = false) {
            const storeArray = isAddressBook ? this.adrBook : this.portfolio
            const item = storeArray.find(i => i.hash.toLowerCase() === _hash.toLowerCase())
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
        },
        addNotification(_notification: NotificationDeleteAddress | Notification) {
            this.notification = Object.assign(_notification)
        },
        clearNotification() {
            this.notification = undefined
        },
        notify(_text: string) {
            this.addNotification({
                _type: NotificationType.PLAIN,
                text: _text
            })
        },
        savePaginationState(state: Map<string, number>) {
            this.paginationStateMap = state
        },
        setDarkMode(theme: string) {
            this.appTheme = theme
        },
        setCurrentLargeBtnPromo(promo: string) {
            this.currentLargeButtonPromo = promo
        },
        setDataShare(_value: boolean) {
            this.dataShare = _value
        },
        setLang(_value: string) {
            this.lang = _value
        }
    }
})
