import { defineStore } from 'pinia'
import { GetLatestPricesQuery, MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { TokenOwnersFragment } from '@module/address/apollo/tokens.generated'
import BN from 'bignumber.js'
import { formatFloatingPointValue, FormattedNumber } from '@core/helper/number-format-helper'
const ETH_ID = 'ethereum'

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
    addressTokenBalance: FormattedNumber | number
    loadingErc20Tokens: boolean
    numOfErc20Tokens: number
}

export const useStore = defineStore('main', {
    state: (): StoreState => {
        return {
            coinData: <GetLatestPricesQuery>{},
            loadingCoinData: false,
            appDrawer: false,
            addressTokenBalance: 0,
            loadingErc20Tokens: false,
            numOfErc20Tokens: 0
        }
    },
    actions: {
        hasData(token: TokenMarketData | null): boolean {
            if (token) {
                return !(token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null)
            }
            return true
        },
        generateTokenMaps(contracts: string[]): Map<string, TokenMarketData> | false {
            if (this.coinData && this.coinData.getLatestPrices) {
                const marketInfo = new Map()
                const requestMarketInfo = new Map<string, TokenMarketData>()
                this.coinData?.getLatestPrices.forEach(token => {
                    if (token?.id !== ETH_ID && this.hasData(token)) {
                        marketInfo.set(token?.contract?.toLowerCase(), token)
                    }
                })

                contracts.forEach(contract => {
                    const token = marketInfo.get(contract.toLowerCase())
                    if (token && token.contract) {
                        requestMarketInfo.set(token.contract.toLowerCase(), token)
                    }
                })
                return requestMarketInfo.size > 0 ? requestMarketInfo : false
            }
            return false
        },
        getUsdInfo(contract: string, tokenMap: Map<string, TokenMarketData> | false): TokenMarketData | false | undefined {
            // Generate prices
            return tokenMap && tokenMap.has(contract) ? tokenMap.get(contract) : false
        },
        computeTokenBalances(tokens: Array<TokenOwnersFragment | null>) {
            this.numOfErc20Tokens = tokens.length
            const contracts = tokens.map(el => (el ? el.tokenInfo.contract : '')).filter(el => el.length)
            let tokenMap: Map<string, TokenMarketData> | false
            let totalUsdBalance = 0
            if (contracts.length > 0) {
                tokenMap = this.generateTokenMaps(contracts)
                const tokensWithPrices = tokens.filter(el => el && this.getUsdInfo(el.tokenInfo.contract, tokenMap))
                totalUsdBalance = tokensWithPrices.reduce((acc, el) => {
                    if (el) {
                        let balance = new BN(el.balance)
                        if (el.tokenInfo.decimals) {
                            balance = balance.div(new BN(10).pow(el.tokenInfo.decimals))
                        }
                        const tokenPrice = this.getUsdInfo(el.tokenInfo.contract, tokenMap)
                        if (tokenPrice && tokenPrice.current_price) {
                            return acc + new BN(tokenPrice.current_price).multipliedBy(balance).toNumber()
                        }
                    }
                    return 0
                }, 0)
            }
            this.addressTokenBalance = formatFloatingPointValue(new BN(totalUsdBalance))
        }
    }
})
