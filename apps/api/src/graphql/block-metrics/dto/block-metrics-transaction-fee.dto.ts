import { assignClean } from '@app/shared/utils'
import { BlockMetricsTransactionFee } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'

export class BlockMetricsTransactionFeeDto implements BlockMetricsTransactionFee {

  avgTxFees!: BigNumber
  blockHash!: string
  number!: BigNumber
  timestamp!: Date
  totalTxFees!: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }

}
