import { TransfersPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TransferDto } from '@app/modules/transfers/dto/transfer.dto'

export class TransfersPageDto extends TransfersPage {
  constructor(data: any) {
    super()
    if (data.items) {
      this.items = data.items.map(i => new TransferDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
