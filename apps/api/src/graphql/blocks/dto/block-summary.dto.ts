import { BlockSummary } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class BlockSummaryDto implements BlockSummary {

  author!: string
  difficulty!: BigNumber
  hash!: string
  numFailedTxs!: BigNumber
  numSuccessfulTxs!: BigNumber
  numTxs!: BigNumber
  number!: BigNumber
  reward!: BigNumber
  timestamp!: Date
  transactionHashes!: string[]
  uncleHashes!: string[]

  constructor(data: any) {
    assignClean(this, data)
  }

}
