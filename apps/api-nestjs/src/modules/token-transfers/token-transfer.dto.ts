import { TokenTransfer } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenTransferDto extends TokenTransfer {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
