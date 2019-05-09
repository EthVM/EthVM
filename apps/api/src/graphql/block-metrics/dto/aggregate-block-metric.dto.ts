import { AggregateBlockMetric } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class AggregateBlockMetricDto implements AggregateBlockMetric {

  timestamp!: Date

  avgBlockTime?: number
  avgDifficulty?: BigNumber
  avgGasLimit?: BigNumber
  avgGasPrice?: BigNumber
  avgNumFailedTxs?: number
  avgNumInternalTxs?: number
  avgNumSuccessfulTxs?: number
  avgNumTxs?: number
  avgNumUncles?: number
  avgTotalDifficulty?: BigNumber
  avgTotalTxFees?: BigNumber
  avgTxFees?: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }

}
