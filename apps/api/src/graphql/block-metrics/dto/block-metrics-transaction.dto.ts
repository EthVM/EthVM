import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import { BlockMetricsTransaction } from '@app/graphql/schema'

export class BlockMetricsTransactionDto implements BlockMetricsTransaction {

  avgGasLimit!: BigNumber
  avgGasPrice!: BigNumber
  blockHash!: string
  number!: BigNumber
  timestamp!: Date
  totalGasPrice!: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }

}
