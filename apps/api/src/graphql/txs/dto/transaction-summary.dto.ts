import { BigNumber, TransactionSummary } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TransactionSummaryDto implements TransactionSummary {

  hash!: string
  blockNumber!: BigNumber
  transactionIndex!: number
  from!: string
  to?: string
  creates?: string
  contractName?: string
  contractSymbol?: string
  value!: BigNumber
  fee!: BigNumber
  successful!: boolean
  timestamp!: Date

  constructor(data: any) {
    assignClean(this, data)
  }

}
