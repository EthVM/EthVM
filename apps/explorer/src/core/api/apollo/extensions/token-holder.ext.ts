import BigNumber from 'bignumber.js'
import { TokenHolder } from '@app/core/api/apollo/types/TokenHolder'

export class TokenHolderExt implements TokenHolder {
  __typename!: 'TokenHolder'
  address: string
  balance: any

  constructor(proto: TokenHolder) {
    this.address = proto.address
    this.balance = proto.balance
  }

  get balanceBN(): BigNumber {
    return new BigNumber(this.balance || 0)
  }
}
