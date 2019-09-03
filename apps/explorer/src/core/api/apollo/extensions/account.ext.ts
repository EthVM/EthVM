import { Account } from '@app/core/api/apollo/types/Account'
import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class AccountExt implements Account {
  __typename!: 'Account'
  address: string
  balance: any
  inTxCount: any
  isContract: boolean
  isContractCreator: boolean
  isMiner: boolean
  outTxCount: any
  totalTxCount: any
  hasInternalTransfers: boolean

  constructor(proto: Account) {
    this.address = proto.address
    this.balance = proto.balance
    this.inTxCount = proto.inTxCount
    this.isContract = proto.isContract
    this.isContractCreator = proto.isContractCreator
    this.isMiner = proto.isMiner
    this.outTxCount = proto.outTxCount
    this.totalTxCount = proto.totalTxCount
    this.hasInternalTransfers = proto.hasInternalTransfers
  }

  get balanceBN(): BigNumber {
    return new BigNumber(this.balance || 0)
  }

  get balanceEth(): BigNumber {
    const ethValue = new EthValue(this.balance || 0)
    return ethValue.toEthBN()
  }

  get balanceFormatted(): FormattedNumber {
    return NumberFormatHelper.formatVariableUnitEthValue(this.balanceBN, 100_000_000_000, true)
  }

  get totalTxCountBN(): BigNumber {
    return new BigNumber(this.totalTxCount || 0)
  }

  get totalTxCountFormatted(): FormattedNumber {
    return NumberFormatHelper.formatIntegerValue(this.totalTxCountBN)
  }
}
