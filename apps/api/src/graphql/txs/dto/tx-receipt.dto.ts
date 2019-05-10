import { BigNumber, Receipt } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxReceiptDto implements Receipt {

  transactionHash!: string
  transactionIndex!: string
  blockHash!: string
  blockNumber!: BigNumber
  from!: string
  to?: string
  contractAddress?: string
  cumulativeGasUsed!: BigNumber
  gasUsed!: BigNumber
  logs!: string
  logsBloom!: string
  root!: string
  status?: string

  constructor(data: any) {
    assignClean(this, data)
  }
}
