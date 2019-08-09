import { Transfer, TransferPage } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'
import { BalanceDeltaDto } from '@app/graphql/transfers/dto/balance-delta.dto'

export class BalanceDeltaPageDto implements TransferPage {
  items!: Transfer[]
  totalCount!: BigNumber

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new BalanceDeltaDto(i))
      delete data.items
    }
    assignClean(this, data)
  }

}
