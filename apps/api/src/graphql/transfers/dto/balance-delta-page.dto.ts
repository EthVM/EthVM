import {Transfer, TransferPage} from '@app/graphql/schema'
import {BalanceDeltaDto} from '@app/graphql/transfers/dto/balance-delta.dto'
import BigNumber from 'bignumber.js'
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity'

export class BalanceDeltaPageDto implements TransferPage {
  items!: Transfer[]
  hasMore!: boolean
  totalCount?: BigNumber

  constructor(items: BalanceDeltaEntity[], hasMore: boolean, totalCount?: BigNumber) {
    if (items) {
      this.items = items.map(i => new BalanceDeltaDto(i))
    }
    this.hasMore = hasMore
    this.totalCount = totalCount
  }

}
