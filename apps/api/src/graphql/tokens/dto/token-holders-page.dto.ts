import {TokenHoldersPage} from '@app/graphql/schema'
import {TokenHolderDto} from '@app/graphql/tokens/dto/token-holder.dto'
import BigNumber from 'bignumber.js'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto'

export class TokenHoldersPageDto implements TokenHoldersPage {

  items!: TokenHolderDto[]
  hasMore!: boolean
  totalCount!: BigNumber

  constructor(items: RawBalanceEntity[], hasMore: boolean, totalCount: BigNumber) {
    if (items) {
      this.items = items.map(i => new TokenHolderDto(i))
    }
    this.hasMore = hasMore
    this.totalCount = totalCount
  }
}
