import { TokenExchangeRate } from '@app/core/api/apollo/types/TokenExchangeRate'
import { TokenExchangeRatePage, TokenExchangeRatePage_items } from '@app/core/api/apollo/types/TokenExchangeRatePage'

export class TokenExchangeRatePageExt_items implements TokenExchangeRatePage_items {
  __typename!: 'TokenExchangeRate'
  address: string | null
  currentPrice: any | null
  image: string | null
  marketCap: any | null
  name: string | null
  priceChangePercentage24h: any | null
  symbol: string | null
  totalVolume: any | null

  constructor(proto: TokenExchangeRate) {
    this.address = proto.address
    this.currentPrice = proto.currentPrice
    this.image = proto.image
    this.marketCap = proto.marketCap
    this.name = proto.name
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.symbol = proto.symbol
    this.totalVolume = proto.totalVolume
  }
}

export class TokenExchangeRatePageExt implements TokenExchangeRatePage {
  __typename!: 'TokenExchangeRatesPage'
  items: TokenExchangeRatePage_items[]
  totalCount: number

  constructor(proto: TokenExchangeRatePage) {
    this.items = proto.items.map(i => new TokenExchangeRatePageExt_items(i))
    this.totalCount = proto.totalCount
  }
}
