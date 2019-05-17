import { TokenPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenDto } from '@app/graphql/tokens/dto/token.dto'

export class TokenPageDto implements TokenPage {
  items!: TokenDto[]
  totalCount!: number

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
