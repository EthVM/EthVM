import BN from 'bignumber.js'
import { TransactionSummaryPage, TransactionSummaryPage_items } from '@app/core/api/apollo/types/TransactionSummaryPage'
import { TransactionSummary } from '@app/core/api/apollo/types/TransactionSummary'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class TransactionSummaryPageExt_items implements TransactionSummaryPage_items {
  __typename!: 'TransactionSummary'
  hash!: string
  blockNumber: any
  transactionIndex!: number
  from!: string
  to!: string | null
  creates!: string | null
  contractName!: string | null
  contractSymbol!: string | null
  value: any
  fee: any
  successful!: boolean
  timestamp!: any

  constructor(proto: TransactionSummary) {
    Object.assign(this, proto)
  }

  get blockNumberBN(): BN {
    return new BN(this.blockNumber)
  }

  get blockNumberFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.blockNumberBN).value
  }

  get feeBN(): BN {
    return new BN(this.fee)
  }

  get feeFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.feeBN)
  }

  get valueBN(): BN {
    return new BN(this.value)
  }

  get valueFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.valueBN)
  }

  get valueFormattedShort(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.valueBN, 2)
  }

  get isContractCreation(): boolean {
    return !!this.creates && this.creates !== ''
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(this.timestamp) : null
  }
}

export class TransactionSummaryPageExt implements TransactionSummaryPage {
  __typename!: 'TransactionSummaryPage'
  items: (TransactionSummaryPageExt_items)[]
  totalCount: any

  constructor(proto: TransactionSummaryPage) {
    this.items = proto.items.map(s => new TransactionSummaryPageExt_items(s as TransactionSummary))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount)
  }
}
