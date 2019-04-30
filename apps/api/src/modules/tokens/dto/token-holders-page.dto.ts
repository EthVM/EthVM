import { TokenHoldersPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenHolderDto } from '@app/modules/tokens/dto/token-holder.dto'

export class TokenHoldersPageDto extends TokenHoldersPage {
  constructor(data: any) {
    super()
    if (data.items) {
      this.items = data.items.map(i => new TokenHolderDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
