import { BlockMetric } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class BlockMetricDto implements BlockMetric {

  avgGasLimit!: BigNumber
  avgGasPrice!: BigNumber
  avgTxFees!: BigNumber
  blockHash!: string
  blockTime!: number
  difficulty!: BigNumber
  numFailedTxs!: number
  numInternalTxs!: number
  numSuccessfulTxs!: number
  numUncles!: number
  number!: BigNumber
  timestamp!: Date
  totalDifficulty!: BigNumber
  totalGasPrice!: BigNumber
  totalTxFees!: BigNumber
  totalTxs!: number

  constructor(data: any) {
    assignClean(this, data)
  }

}
