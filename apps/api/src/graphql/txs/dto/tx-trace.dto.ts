import { BigNumber, Trace } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxTraceDto implements Trace {

  blockHash!: string
  transactionHash?: string
  rootError?: string
  traces!: string

  constructor(data: any) {
    assignClean(this, data)
  }
}
