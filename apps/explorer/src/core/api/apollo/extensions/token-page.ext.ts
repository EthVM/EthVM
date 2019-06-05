import BN from 'bignumber.js'
import { TokenPage, TokenPage_items } from '@app/core/api/apollo/types/TokenPage'
import { Token } from '@app/core/api/apollo/types/Token'

export class TokenPageExt_items implements TokenPage_items {
  __typename!: 'Token'
  address: string | null
  balance: any | null
  currentPrice: any | null
  decimals: number | null
  name: string | null
  symbol: string | null
  priceChange24h: any | null

  constructor(proto: Token) {
    this.address = proto.address
    this.balance = proto.balance
    this.currentPrice = proto.currentPrice
    this.decimals = proto.decimals
    this.name = proto.name
    this.symbol = proto.symbol
    this.priceChange24h = proto.priceChange24h
  }

  get currentPriceBN(): BN | null {
    return this.currentPrice ? new BN(this.currentPrice) : null
  }

  get formattedBalance(): string {
    const { decimals, balanceBN } = this

    if (!decimals) {
      return balanceBN.toFixed()
    }

    return balanceBN.div(new BN(10).pow(decimals)).toFixed()
  }

  get balanceBN(): BN {
    return new BN(this.balance || 0)
  }

  get usdValueBN(): BN {
    const { currentPriceBN, balanceBN } = this

    if (!currentPriceBN) {
      return new BN(0.0)
    }

    return balanceBN.multipliedBy(currentPriceBN)
  }

  get priceChange24hBN(): BN | null {
    return this.priceChange24h ? new BN(this.priceChange24h) : null
  }
}

export class TokenPageExt implements TokenPage {
  __typename!: 'TokenPage'
  items: (TokenPageExt_items)[]
  totalCount: number

  constructor(proto: TokenPage) {
    this.items = proto.items.map(s => new TokenPageExt_items(s as Token))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount)
  }
}
