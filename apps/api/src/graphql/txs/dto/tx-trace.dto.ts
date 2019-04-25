import { Trace } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxTraceDto extends Trace {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
