import { TokenBalancePage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenBalanceDto } from '@app/graphql/tokens/dto/token-balance.dto'
import BigNumber from 'bignumber.js';

export class TokenBalancePageDto implements TokenBalancePage {
  items!: TokenBalanceDto[]
  hasMore!: boolean
  totalCount!: BigNumber

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenBalanceDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
