import { BigNumber, Trace } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxTraceDto implements Trace {

  blockHash!: string
  transactionHash?: string
  traceAddress!: string
  transactionPosition?: number
  blockNumber!: BigNumber
  subtraces!: number
  error?: string
  type!: string
  action!: string
  result!: string

  constructor(data: any) {
    assignClean(this, data)
  }
}
