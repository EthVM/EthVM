import { Component, Vue } from 'vue-property-decorator'
import { getLatestPrices } from './getLatestPrices.graphql'
import { checkToken } from '@app/modules/favorite-tokens/handlers/checkToken.graphql'
import { getLatestPrices_getLatestPrices as TokenMarketData } from './apolloTypes/getLatestPrices'

const ETHER_ID = 'ethereum'

@Component({
    apollo: {
        getLatestPrices: {
            query: getLatestPrices,
            fetchPolicy: 'cache-and-network',
            pollInterval: 300000,
            update: data => {
                return data.getLatestPrices
            },
            skip() {
                return this.isRopsten
            },
            result({ data }) {
                if (data && data.getLatestPrices && data.getLatestPrices.length > 0) {
                    data.getLatestPrices.forEach((token, index) => {
                        token['isAdded'] = this.checkIfAdded(token.contract)
                        if (token.id === ETHER_ID) {
                            this.etherPrice = token.current_price
                        } else if (this.hasData(token)) {
                            this.tokensMarketInfo.set(token.contract.toLowerCase(), token)
                        } else {
                            this.getLatestPrices.splice(index, 1)
                        }
                    })
                    this.isLoadingTokensMarketData = false
                }
            }
        },
        checkToken: {
            query: checkToken,
            client: 'FavTokClient',
            fetchPolicy: 'network-only',
            variables: {
                address: ''
            },
            result({ data, loading }) {
                if (loading) {
                    return false
                }
                return data ? true : false
            },
            error(err) {
                console.log(err)
            }
        }
    }
})
export class CoinData extends Vue {
    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */
    isRopsten: boolean = false
    getLatestPrices!: TokenMarketData[]
    tokensMarketInfo = new Map<string, TokenMarketData>()
    isLoadingTokensMarketData = true
    etherPrice: number = 0

    /*
    ===================================================================================
     Computed
    ===================================================================================
    */

    get ethPrice(): number | undefined {
        return this.isLoadingTokensMarketData || this.etherPrice === 0 ? undefined : this.etherPrice
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    checkIfAdded(address = '0x43689531907482bee7e650d18411e284a7337a66') {
        this.$apollo.queries.checkToken.refetch({
            address: address
        })
    }
    /**
     * Fetch EthereumTokens
     * @returns {Array} TokenMarketData or {Boolean}
     */
    getEthereumTokens(): TokenMarketData[] | false {
        if (!this.isLoadingTokensMarketData && this.getLatestPrices.length > 0) {
            return this.getLatestPrices.filter(item => item.id !== ETHER_ID)
        }
        return false
    }
    /**
     * Generate ethereum token map
     * @param contract String[]
     * @returns {Map} TokenMarketData or {Boolean}
     */
    getEthereumTokensMap(contracts: string[]): Map<string, TokenMarketData> | false {
        if (!this.isLoadingTokensMarketData) {
            const requestMarketInfo = new Map<string, TokenMarketData>()
            contracts.forEach(contract => {
                const token = this.tokensMarketInfo.get(contract.toLowerCase())
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
    getEthereumTokenByContract(contract: string): TokenMarketData | false {
        if (!this.isLoadingTokensMarketData) {
            const token = this.tokensMarketInfo.get(contract.toLowerCase())
            if (token) {
                return token
            }
        }
        return false
    }
    /**
     * Check if token has data
     * @param token TokenMarketData
     * @returns {Boolean}
     */
    hasData(token: TokenMarketData): boolean {
        if (token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null) {
            return false
        }
        return true
    }
}
