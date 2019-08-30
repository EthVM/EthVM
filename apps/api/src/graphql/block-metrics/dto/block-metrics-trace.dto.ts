import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import {BlockMetricsTrace} from '@app/graphql/schema';

export class BlockMetricsTraceDto implements BlockMetricsTrace {

  avgGasLimit!: BigNumber
  avgGasPrice!: BigNumber
  hash!: string
  number!: BigNumber
  timestamp!: Date
  totalGasPrice!: BigNumber
  totalTxFees!: BigNumber
  avgTxFees!: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }

}
