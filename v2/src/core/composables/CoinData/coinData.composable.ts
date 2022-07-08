import { useGetLatestPricesQuery, MarketDataFragment as TokenMarketData } from './getLatestPrices.generated'
import { computed } from 'vue'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'

export function useCoinData() {
    const store = useStore()
    const { coinData, loadingCoinData } = storeToRefs(store)
    // const { result, loading } = useGetLatestPricesQuery({ pollInterval: 300000 })
    const hasData = (token: TokenMarketData | null): boolean => {
        if (token) {
            return !(token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null)
        }
        return true
    }

    const filteredLatestPrice = computed<any>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value?.getLatestPrices.filter(token => hasData(token) && token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    const ethereumTokens = computed<any>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value?.getLatestPrices.filter(token => token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    const tokensMarketInfo = computed<Map<string, TokenMarketData>>(() => {
        const marketInfo = new Map()
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            coinData.value?.getLatestPrices.forEach(token => {
                if (token?.id !== 'ethereum' && hasData(token)) {
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

    return { ethereumTokens, filteredLatestPrice, getEthereumTokenByContract, getEthereumTokensMap, loading: loadingCoinData }
}
