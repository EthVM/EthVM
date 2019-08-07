import { Transfer, TransferPage } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { InternalTransferDto } from '@app/graphql/transfers/dto/internal-transfer.dto'
import { assignClean } from '@app/shared/utils'

export class BalanceDeltaPageDto implements TransferPage {
  items!: Transfer[]
  totalCount!: BigNumber

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new InternalTransferDto(i))
      delete data.items
    }
    assignClean(this, data)
  }

}
