import { TokenHolder } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenHolderDto extends TokenHolder {
  constructor(data: any) {
    super()
    this.balance = data.amount
    assignClean(this, data)
  }
}
