import { BigNumber, TokenHolder } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenHolderDto implements TokenHolder {

  address!: string
  balance!: BigNumber

  constructor(data: any) {
    this.balance = data.amount
    assignClean(this, data)
  }
}
