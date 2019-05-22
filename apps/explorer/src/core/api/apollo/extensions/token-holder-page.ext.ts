import { TokenHolderPage, TokenHolderPage_items } from '@app/core/api/apollo/types/TokenHolderPage'
import BigNumber from 'bignumber.js'

export class TokenHolderPageExt_items implements TokenHolderPage_items {
  __typename!: 'TokenHolder'
  address: string
  balance: any

  constructor(proto: TokenHolderPage_items) {
    this.address = proto.address
    this.balance = proto.balance
  }

  get balanceBN(): BigNumber {
    return new BigNumber(this.balance || 0)
  }
}

export class TokenHolderPageExt implements TokenHolderPage {
  __typename!: 'TokenHoldersPage'
  items: TokenHolderPageExt_items[]
  totalCount: number

  constructor(proto: TokenHolderPage) {
    this.totalCount = proto.totalCount
    this.items = proto.items.map(i => new TokenHolderPageExt_items(i))
  }

  get totalCountBN(): BigNumber {
    return new BigNumber(this.totalCount)
  }
}
