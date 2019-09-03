import BN from 'bignumber.js'
import { ContractSummaryPage, ContractSummaryPage_items } from '@app/core/api/apollo/types/ContractSummaryPage'
import { ContractSummary } from '@app/core/api/apollo/types/ContractSummary'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class ContractSummaryPageExt_items implements ContractSummaryPage_items {
  __typename!: 'ContractSummary'
  address!: string
  creator!: string
  blockNumber: any
  txHash!: string
  timestamp!: number
  txFee: any

  constructor(proto: ContractSummary) {
    Object.assign(this, proto)
  }

  get blockNumberBN(): BN {
    return new BN(this.blockNumber)
  }

  get txFeeBN(): BN {
    return new BN(this.txFee)
  }

  get txFeeFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.txFeeBN)
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(this.timestamp) : null
  }
}

export class ContractSummaryPageExt implements ContractSummaryPage {
  __typename!: 'ContractSummaryPage'
  items: (ContractSummaryPageExt_items)[]
  hasMore: boolean

  constructor(proto: ContractSummaryPage) {
    this.items = proto.items.map(s => new ContractSummaryPageExt_items(s as ContractSummary))
    this.hasMore = proto.hasMore
  }
}
