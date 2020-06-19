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
    price: number
    marketCap: number
    volume: number
    percentChange24h: number
}

export { IPluginOptions, IEthereumToken, ICacheObject }
