import { TokenBalancePage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenBalanceDto } from '@app/graphql/tokens/dto/token-balance.dto'

export class TokenBalancePageDto implements TokenBalancePage {
  items!: TokenBalanceDto[]
  totalCount!: number

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenBalanceDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
