import BN from 'bignumber.js'
import { TransferPage, TransferPage_items } from '@app/core/api/apollo/types/TransferPage'
import { Transfer } from '@app/core/api/apollo/types/Transfer'
import { DeltaType } from '@app/core/api/apollo/types/globalTypes'

export class TransferPageExt_items implements TransferPage_items {
  __typename!: 'Transfer'
  deltaType!: DeltaType
  from: string | null
  id!: string
  timestamp!: any
  to!: string
  transactionHash: string | null
  value: any
  address: string | null

  constructor(proto: Transfer) {
    this.deltaType = proto.deltaType
    this.from = proto.from
    this.id = proto.id
    this.timestamp = proto.timestamp
    this.to = proto.to
    this.transactionHash = proto.transactionHash
    this.value = proto.value
    this.address = proto.address
  }

  get valueBN(): BN | null {
    return this.value ? new BN(this.value) : null
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(this.timestamp) : null
  }
}

export class TransferPageExt implements TransferPage {
  __typename!: 'TransferPage'
  items: (TransferPageExt_items)[]
  totalCount: any

  constructor(proto: TransferPage) {
    this.items = proto.items.map(s => new TransferPageExt_items(s as Transfer))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount)
  }
}
