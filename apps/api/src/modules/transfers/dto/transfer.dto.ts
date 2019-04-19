import { Transfer } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TransferDto extends Transfer {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
