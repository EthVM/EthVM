import { TokenHoldersPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenHolderDto } from '@app/graphql/tokens/dto/token-holder.dto'
import BigNumber from 'bignumber.js';

export class TokenHoldersPageDto implements TokenHoldersPage {

  items!: TokenHolderDto[]
  hasMore!: boolean
  totalCount!: BigNumber

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenHolderDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
