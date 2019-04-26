import { Receipt } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TxReceiptDto extends Receipt {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
