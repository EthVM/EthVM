import { Transaction } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxDto extends Transaction {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
