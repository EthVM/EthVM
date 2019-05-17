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

  constructor(proto: Token) {
    this.address = proto.address
    this.balance = proto.balance
    this.currentPrice = proto.currentPrice
    this.decimals = proto.decimals
    this.name = proto.name
    this.symbol = proto.symbol
  }

  get currentPriceBN(): BN | null {
    return this.currentPrice ? new BN(this.currentPrice) : null
  }

  get balanceBN(): BN | null {
    return this.balance ? new BN(this.balance) : null
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
}
