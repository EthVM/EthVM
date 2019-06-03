import { BlockSummaryPage, BlockSummaryPage_items } from '@app/core/api/apollo/types/BlockSummaryPage'
import BN from 'bignumber.js'

export class BlockSummaryPageExt_items implements BlockSummaryPage_items {
  __typename!: 'BlockSummary'
  author!: string
  difficulty: any
  hash!: string
  numFailedTxs: any
  numSuccessfulTxs: any
  numTxs: any
  number: any
  reward: any
  timestamp!: any
  transactionHashes!: string[]
  uncleHashes!: string[]

  constructor(proto: any) {
    Object.assign(this, proto)
  }

  get numberBN(): BN {
    return new BN(this.number)
  }

  get numTxsBN(): BN {
    return new BN(this.numTxs)
  }

  get numFailedTxsBN(): BN {
    return new BN(this.numFailedTxs)
  }

  get numSuccessfulTxsBN(): BN {
    return new BN(this.numSuccessfulTxs)
  }

  get rewardBN(): BN {
    return new BN(this.reward)
  }

  get difficultyBN(): BN {
    return new BN(this.difficulty)
  }

  get timestampDate(): Date {
    return new Date(this.timestamp)
  }
}

export class BlockSummaryPageExt implements BlockSummaryPage {
  __typename!: 'BlockSummaryPage'
  items: BlockSummaryPageExt_items[]
  totalCount: number

  constructor(proto: BlockSummaryPage) {
    this.items = proto.items!.map(s => new BlockSummaryPageExt_items(s))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount)
  }
}
