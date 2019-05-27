import { TokenHolder, TokenHoldersPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenHolderDto } from '@app/graphql/tokens/dto/token-holder.dto'

export class TokenHoldersPageDto implements TokenHoldersPage {

  items!: TokenHolderDto[]
  totalCount!: number

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenHolderDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
