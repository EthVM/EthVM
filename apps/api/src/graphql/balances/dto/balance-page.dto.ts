import { BalanceNew, BalancePage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BalanceDto } from '@app/graphql/balances/dto/balance.dto'

export class BalancePageDto implements BalancePage {
  items!: BalanceNew[]
  totalCount!: number

  constructor(data) {
    if (data.items) {
      this.items = data.items.map(i => new BalanceDto(i))
      delete data.items
    }
    assignClean(this, data)
  }

}
