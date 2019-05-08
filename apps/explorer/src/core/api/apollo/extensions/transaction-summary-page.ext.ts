import BN from 'bignumber.js'
import { TransactionSummaryPage, TransactionSummaryPage_items } from '@app/core/api/apollo/types/TransactionSummaryPage'
import { TransactionSummary } from '@app/core/api/apollo/types/TransactionSummary'
import { TransactionSummaryExt } from '@app/core/api/apollo/extensions/transaction-summary.ext'
import { Hex } from '@app/core/models'

export class TransactionSummaryPageExt_items implements TransactionSummaryPage_items {
  __typename!: 'TransactionSummary'
  blockNumber!: any | null
  transactionIndex!: number | null
  creates!: string | null
  contractName!: string | null
  contractSymbol!: string | null
  fee!: any | null
  from!: string | null
  hash!: string | null
  successful!: boolean | null
  timestamp!: string | null
  to!: string | null
  value!: any | null

  constructor(proto: TransactionSummary) {
    Object.assign(this, proto)
  }

  get blockNumberBN(): BN {
    return new BN(this.blockNumber)
  }

  get fromHex(): Hex {
    return new Hex(this.from || '')
  }

  get toHex(): Hex {
    return new Hex(this.to || '')
  }

  get createsHex(): Hex {
    return new Hex(this.creates || '')
  }

  get feeBN(): BN {
    return new BN(this.fee)
  }

  get valueBN(): BN {
    return new BN(this.value)
  }

  get isContractCreation(): boolean {
    return !!this.creates && this.creates !== ''
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(+this.timestamp * 1000) : null
  }
}

export class TransactionSummaryPageExt implements TransactionSummaryPage {
  __typename!: 'TransactionSummaryPage'
  items: (TransactionSummaryPageExt_items | null)[] | null
  totalCount: any | null

  constructor(proto: TransactionSummaryPage) {
    this.items = proto.items!.map(s => new TransactionSummaryPageExt_items(s as TransactionSummary))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount)
  }
}
