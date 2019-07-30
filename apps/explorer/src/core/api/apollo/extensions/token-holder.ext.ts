import BigNumber from 'bignumber.js'
import { TokenHolder } from '@app/core/api/apollo/types/TokenHolder'

export class TokenHolderExt implements TokenHolder {
  __typename!: 'TokenHolder'
  address: string
  balance: any
  totalTransfers: any

  constructor(proto: TokenHolder, totalTransfers?: any) {
    this.address = proto.address
    this.balance = proto.balance
    this.totalTransfers = totalTransfers
  }

  get balanceBN(): BigNumber {
    return new BigNumber(this.balance || 0)
  }

  get totalTransfersBN(): BigNumber | undefined {
    return this.totalTransfers ? new BigNumber(this.totalTransfers) : undefined
  }
}
