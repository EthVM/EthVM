import BN from 'bignumber.js'
import { TokenPage, TokenPage_items } from '@app/core/api/apollo/types/TokenPage'
import { Token } from '@app/core/api/apollo/types/Token'
import { TokenUtils } from '@app/core/helper/token.utils'

export class TokenPageExt_items implements TokenPage_items {
  __typename!: 'Token'
  address: string | null
  balance: any | null
  currentPrice: any | null
  decimals: number | null
  name: string | null
  symbol: string | null
  priceChangePercentage24h: any | null
  image: string | null

  constructor(proto: Token) {
    this.address = proto.address
    this.balance = proto.balance
    this.currentPrice = proto.currentPrice
    this.decimals = proto.decimals
    this.name = proto.name
    this.symbol = proto.symbol
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.image = proto.image
  }

  get currentPriceBN(): BN | null {
    return TokenUtils.currentPriceBN(this)
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

  get priceChangePercentage24hBN(): BN | null {
    return TokenUtils.priceChangePercentage24hBN(this)
  }

  get priceChangeFormatted(): string {
    return TokenUtils.priceChangeFormatted(this)
  }

  get priceChangeSymbol(): string {
    return TokenUtils.priceChangeSymbol(this)
  }

  get priceChangeClass(): string {
    return TokenUtils.priceChangeClass(this)
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
