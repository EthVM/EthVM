import { Transfer, TransferPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { InternalTransferDto } from '@app/graphql/transfers/dto/internal-transfer.dto'

export class InternalTransferPageDto implements TransferPage {

  items!: Transfer[];
  hasMore!: boolean;

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new InternalTransferDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
