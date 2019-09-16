import { Transfer, TransferPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BalanceDeltaDto } from '@app/graphql/transfers/dto/balance-delta.dto'
import BigNumber from 'bignumber.js'

export class BalanceDeltaPageDto implements TransferPage {
  items!: Transfer[]
  hasMore!: boolean
  totalCount?: BigNumber

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new BalanceDeltaDto(i))
      delete data.items
    }
    assignClean(this, data)
  }

}
