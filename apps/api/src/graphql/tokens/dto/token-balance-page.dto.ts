import { TokenBalancePage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenBalanceDto } from '@app/graphql/tokens/dto/token-balance.dto'
import BigNumber from 'bignumber.js'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto'

export class TokenBalancePageDto implements TokenBalancePage {
  items!: TokenBalanceDto[]
  hasMore!: boolean
  totalCount!: BigNumber

  constructor(items: RawBalanceEntity[], hasMore: boolean, totalCount: BigNumber) {
    this.items = items.map(i => new TokenBalanceDto(i))
    this.hasMore = hasMore
    this.totalCount = totalCount
  }
}
