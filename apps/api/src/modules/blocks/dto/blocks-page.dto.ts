import { BlocksPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BlockDto } from '@app/modules/blocks/dto/block.dto'

export class BlocksPageDto extends BlocksPage {
  constructor(data: any) {
    super()
    if (data.items) {
      this.items = data.items.map(i => new BlockDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
