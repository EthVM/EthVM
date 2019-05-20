import { BlocksPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BlockDto } from '@app/graphql/blocks/dto/block.dto'

export class BlocksPageDto implements BlocksPage {

  items!: BlockDto[]
  totalCount!: number

  constructor(data: any) {
    assignClean(this, data)
    if (data.items) {
      this.items = data.items.map(i => new BlockDto(i))
    }
  }
}
