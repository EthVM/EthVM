import { Component, Vue } from 'vue-property-decorator'
import { getLatestPrices } from './getLatestPrices.graphql'
import { getLatestPrices_getLatestPrices as TokenMarketData } from './apolloTypes/getLatestPrices'

@Component({
    apollo: {
        getLatestPrices: {
            query: getLatestPrices,
            fetchPolicy: 'cache-first',
            pollInterval: 300000,
            update: data => {
                return data.getLatestPrices
            },
            skip() {
                return this.isRopsten
            },
            result({ data }) {
                if (data && data.getLatestPrices.length > 0) {
                    data.getLatestPrices.forEach(token => {
                        this.tokensMarketInfo.set(token.contract.toLowerCase(), token)
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

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    cre

    getEthereumTokensMap(contracts: string[]): Promise<Map<string, IEthereumToken> | false> {
        return this.getEthereumTokens().then(tokens => {
            const tokensMarketInfo = new Map<string, IEthereumToken>()
            const _contracts = contracts.map(i => i.toLowerCase())
            for (const token of tokens) {
                if (_contracts.includes(token.contract.toLowerCase())) {
                    tokensMarketInfo.set(token.contract.toLowerCase(), token)
                }
            }
            if (tokensMarketInfo.size > 0) {
                return tokensMarketInfo
            }
            return false
        })
    }
    // getEthereumTokenByContract(contract: string): TokenMarketData | false{
    //   if (!this.isLoadingTokensMarketData && this.getLatestPrices.length > 0) {
    //     for (const token of this.getLatestPrices) {
    //       if (token.contract.toLowerCase() === contract.toLowerCase()) {
    //           return token
    //       }
    //   }

    // }
    // return false

    //  }
}
