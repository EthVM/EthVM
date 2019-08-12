import { Transfer, TransferPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TransferDto } from '@app/graphql/transfers/dto/transfer.dto'

export class TransferPageDto implements TransferPage {

  items!: Transfer[];
  hasMore!: boolean;

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TransferDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
