import { VueConstructor } from 'vue'
import fetch from 'node-fetch'
import { keccak256 } from 'web3-utils'
import BN from 'bignumber.js'
interface IPrototype {
    prototype: any
}
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
    platforms: {
        ethereum: string
    }
    image: string
    price: BN
}
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/'

class CoinData {
    cache: ICacheObject = {}
    ttl: number = 10000
    fetchWithCache(query: string): Promise<any> {
        const queryHash: string = keccak256(query)
        if (this.cache[queryHash] && this.cache[queryHash].ttl > new Date().getTime()) {
            return Promise.resolve(this.cache[queryHash].data)
        }
        return fetch(COINGECKO_API_URL + query)
            .then(res => res.json())
            .then(json => {
                this.cache[queryHash] = {
                    ttl: new Date().getTime() + this.ttl,
                    data: json
                }
                return json
            })
    }
    getEthereumTokens(): Promise<IEthereumToken[]> {
        const QUERY_ALL_ETH_TOKENS: string = 'coins/list?include_platform=true&asset_platform_id=ethereum&order_by_market_cap=true'
        const QUERY_TOKEN_PRICES: string = 'coins/markets?vs_currency=usd&ids='
        return this.fetchWithCache(QUERY_ALL_ETH_TOKENS).then((tokens: IEthereumToken[]) => {
            tokens = tokens.slice(0, 200)
            let temparray: IEthereumToken[]
            const promises: Promise<any>[] = []
            const chunk = 50
            for (let i = 0, j = tokens.length; i < j; i += chunk) {
                temparray = tokens.slice(i, i + chunk)
                const idMap = temparray.map((_t: IEthereumToken) => {
                    return _t.id
                })
                promises.push(
                    this.fetchWithCache(QUERY_TOKEN_PRICES + idMap.join(',')).then(_resp => {
                        _resp.forEach(_tokenInfo => {
                            for (const _tidx in tokens) {
                                if (tokens[_tidx].id === _tokenInfo.id) {
                                    tokens[_tidx].price = _tokenInfo.current_price
                                    tokens[_tidx].contract = tokens[_tidx].platforms.ethereum
                                    tokens[_tidx].image = 'https://img.mewapi.io/?image=' + _tokenInfo.image
                                    return
                                }
                            }
                        })
                    })
                )
            }
            return Promise.all(promises).then(() => {
                return tokens
            })
        })
    }
    install(Vue: VueConstructor<Vue>, options: IPluginOptions): void {
        if (options.ttl) {
            this.ttl = options.ttl
        }
        Vue.prototype[options.varName ? options.varName : '$CD'] = {
            getEthereumTokens: this.getEthereumTokens.bind(this)
        }
    }
}
export interface ICoinData {
    getEthereumTokens(): Promise<IEthereumToken[]>
}
export default CoinData
