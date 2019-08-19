import BigNumber from 'bignumber.js'
import { TokenHolder } from '@app/core/api/apollo/types/TokenHolder'
import { NumberFormatHelper } from '@app/core/helper/number-format-helper'

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

  get totalTransfersBN(): BigNumber {
    return new BigNumber(this.totalTransfers || 0)
  }

  get totalTransfersFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.totalTransfersBN).value
  }
}
