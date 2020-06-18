import { VueConstructor } from 'vue'
import { request } from 'graphql-request'
import { keccak256 } from 'web3-utils'
import Configs from '@app/configs'

interface IPluginOptions {
    ttl: number
    varName: string
}
interface ICacheObject {
    [key: string]: {
        ttl: number
        data: any
    }
}
interface IEthereumToken {
    id: string
    symbol: string
    name: string
    contract: string
    image: string
    price: number
    marketCap: number
    volume: number
    percentChange24h: number
}
const HOST_URL = Configs.APOLLO_HTTP

class CoinData {
    cache: ICacheObject = {}
    ttl: number = 10000
    fetchWithCache(query: string): Promise<any> {
        const queryHash: string = keccak256(query)
        if (this.cache[queryHash] && this.cache[queryHash].ttl > new Date().getTime()) {
            return Promise.resolve(this.cache[queryHash].data)
        }
        return request(HOST_URL, query).then(json => {
            this.cache[queryHash] = {
                ttl: new Date().getTime() + this.ttl,
                data: json
            }
            return json
        })
    }
    getEthereumTokens(): Promise<IEthereumToken[]> {
        const QUERY_ALL_ETH_TOKENS: string = `{
                                                getLatestPrices{
                                                        id
                                                        current_price
                                                        market_cap
                                                        total_volume
                                                        price_change_percentage_24h
                                                        contract
                                                        image
                                                }
                                            }`
        const allTokens: IEthereumToken[] = []
        return this.fetchWithCache(QUERY_ALL_ETH_TOKENS).then(tokens => {
            tokens = tokens.getLatestPrices
            tokens.forEach(_tokenInfo => {
                allTokens.push({
                    id: _tokenInfo.id,
                    symbol: _tokenInfo.symbol,
                    name: _tokenInfo.name,
                    price: _tokenInfo.current_price,
                    marketCap: _tokenInfo.market_cap,
                    volume: _tokenInfo.total_volume,
                    percentChange24h: _tokenInfo.price_change_percentage_24h,
                    contract: _tokenInfo.contract,
                    image: 'https://img.mewapi.io/?image=' + _tokenInfo.image
                })
            })
            return allTokens
        })
    }
    getEthereumTokenByContract(contract: string): Promise<IEthereumToken | false> {
        return this.getEthereumTokens().then(tokens => {
            for (const token of tokens) {
                if (token.contract.toLowerCase() === contract.toLowerCase()) {
                    return token
                }
            }
            return false
        })
    }
    install(Vue: VueConstructor<Vue>, options: IPluginOptions): void {
        if (options.ttl) {
            this.ttl = options.ttl
        }
        Vue.prototype[options.varName ? options.varName : '$CD'] = {
            getEthereumTokens: this.getEthereumTokens.bind(this),
            getEthereumTokenByContract: this.getEthereumTokenByContract.bind(this)
        }
    }
}
export interface ICoinData {
    getEthereumTokens(): Promise<IEthereumToken[]>
    getEthereumTokenByContract(contract: string): Promise<IEthereumToken | false>
}
export default CoinData
