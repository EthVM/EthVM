import { Account } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity'
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity'

export class AccountDto implements Account {

  address!: string
  balance!: BigNumber
  inTxCount!: BigNumber
  isContractCreator!: boolean
  isMiner!: boolean
  outTxCount!: BigNumber
  totalTxCount!: BigNumber
  isContract!: boolean
  hasInternalTransfers!: boolean

  constructor(
    balance: BalanceEntity,
    isMiner: boolean,
    isContractCreator: boolean,
    hasInternalTransfers: boolean,
    isContract: boolean,
    txCounts: AddressTransactionCountEntity,
  ) {
    // Set balance info
    this.address = balance.address
    this.balance = balance.balance!

    // Set boolean info fields
    this.isContract = isContract
    this.isContractCreator = isContractCreator
    this.isMiner = isMiner
    this.hasInternalTransfers = hasInternalTransfers

    // Set tx count info
    this.totalTxCount = txCounts.total || 0
    this.inTxCount = txCounts.totalIn || 0
    this.outTxCount = txCounts.totalOut || 0
  }
}
