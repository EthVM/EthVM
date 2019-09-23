import {Balance, BalancePage} from '@app/graphql/schema'
import {BalanceDto, RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto'

export class BalancePageDto implements BalancePage {
  items!: Balance[]
  hasMore!: boolean

  constructor(items: RawBalanceEntity[], hasMore: boolean) {
    if (items) {
      this.items = items.map(i => new BalanceDto(i))
    }
    this.hasMore = hasMore
  }

}
