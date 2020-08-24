import { Component, Vue } from 'vue-property-decorator'
import { getLatestPrices } from './getLatestPrices.graphql'
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
                if (data && data.getLatestPrices.length > 0) {
                    data.getLatestPrices.forEach((token, index) => {
                        if (token.id === ETHER_ID) {
                            this.etherPrice = token.current_price
                            this.getLatestPrices.splice(index, 1)
                        } else if (this.hasData(token)) {
                            this.tokensMarketInfo.set(token.contract.toLowerCase(), token)
                        } else {
                            this.getLatestPrices.splice(index, 1)
                        }
                    })
                    this.isLoadingTokensMarketData = false
                }
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
    getEthereumTokens(): TokenMarketData[] | false {
        if (!this.isLoadingTokensMarketData && this.getLatestPrices.length > 0) {
            console.log(this.getLatestPrices)
            return this.getLatestPrices
        }
        return false
    }

    getEthereumTokensMap(contracts: string[]): Map<string, TokenMarketData> | false {
        if (!this.isLoadingTokensMarketData) {
            const requestMarketInfo = new Map<string, TokenMarketData>()
            contracts.forEach(contract => {
                const token = this.tokensMarketInfo.get(contract)
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

    getEthereumTokenByContract(contract: string): TokenMarketData | false {
        if (!this.isLoadingTokensMarketData) {
            const token = this.tokensMarketInfo.get(contract)
            if (token) {
                return token
            }
        }
        return false
    }

    hasData(token: TokenMarketData): boolean {
        if (token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null) {
            return false
        }
        return true
    }
}
