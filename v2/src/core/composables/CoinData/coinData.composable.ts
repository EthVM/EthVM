import { MarketDataFragment as TokenMarketData } from './getLatestPrices.generated'
import { computed } from 'vue'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'

const ETH_ID = 'ethereum'

export function useCoinData() {
    const store = useStore()
    const { coinData, loadingCoinData } = storeToRefs(store)
    const hasData = (token: TokenMarketData | null): boolean => {
        if (token) {
            return !(token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null)
        }
        return true
    }
    /**
     * Returns market info for ETH ONLY
     */
    const ethMarketInfo = computed<TokenMarketData | null>(() => {
        if (loadingCoinData.value === false && coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value.getLatestPrices.filter(token => token?.id === ETH_ID)
            return filteredRes[0] || null
        }
        return null
    })

    const filteredLatestPrice = computed<Array<TokenMarketData | null>>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value.getLatestPrices.filter(token => hasData(token) && token?.id !== ETH_ID)
            return filteredRes || []
        }
        return []
    })

    const ethereumTokens = computed<Array<TokenMarketData | null>>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = filteredLatestPrice.value.filter(token => token?.id !== ETH_ID)
            return filteredRes || []
        }
        return []
    })

    const tokensMarketInfo = computed<Map<string, TokenMarketData>>(() => {
        const marketInfo = new Map()
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            coinData.value?.getLatestPrices.forEach(token => {
                if (token?.id !== ETH_ID && hasData(token)) {
                    marketInfo.set(token?.contract?.toLowerCase(), token)
                }
            })
        }
        return marketInfo
    })

    /**
     * Generate ethereum token map
     * @param contracts String[]
     * @returns {Map} TokenMarketData or {Boolean}
     */
    const getEthereumTokensMap = (contracts: string[]): Map<string, TokenMarketData> | false => {
        if (!loadingCoinData.value) {
            const requestMarketInfo = new Map<string, TokenMarketData>()
            contracts.forEach(contract => {
                const token = tokensMarketInfo.value.get(contract.toLowerCase())
                if (token && token.contract) {
                    requestMarketInfo.set(token.contract.toLowerCase(), token)
                }
            })
            if (requestMarketInfo.size > 0) {
                return requestMarketInfo
            }
        }
        return false
    }

    /**
     * Generate ethereum tokens by contract
     * @param contract String[]
     * @returns {Map} TokenMarketData or {Boolean}
     */
    const getEthereumTokenByContract = (contract: string): TokenMarketData | false => {
        if (!loadingCoinData.value) {
            const token = tokensMarketInfo.value.get(contract.toLowerCase())
            if (token) {
                return token
            }
        }
        return false
    }

    return { ethMarketInfo, ethereumTokens, filteredLatestPrice, getEthereumTokenByContract, getEthereumTokensMap, loading: loadingCoinData }
}
