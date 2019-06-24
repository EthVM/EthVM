import { BigNumber, TokenHolder } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenHolderEntity } from '@app/orm/entities/token-holder.entity'

export class TokenHolderDto implements TokenHolder {

  address!: string
  balance!: BigNumber

  constructor(data: TokenHolderEntity) {
    assignClean(this, data)
  }
}
