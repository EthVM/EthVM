import { BigNumber, Balance, BalancesPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BalanceDto } from '@app/graphql/transfers/dto/balance.dto'

export class BalancesPageDto implements BalancesPage {

  items!: Balance[];
  totalCount!: BigNumber;

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new BalanceDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
