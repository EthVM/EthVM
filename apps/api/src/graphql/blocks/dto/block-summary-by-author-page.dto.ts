import { BlockSummary, BlockSummaryByAuthorPage } from '@app/graphql/schema'
import { BlockSummaryDto } from '@app/graphql/blocks/dto/block-summary.dto'

export class BlockSummaryByAuthorPageDto implements BlockSummaryByAuthorPage {

  items: BlockSummaryDto[]
  hasMore: boolean

  constructor(items: BlockSummary[], hasMore: boolean) {
    this.items = items.map(s => new BlockSummaryDto(s))
    this.hasMore = hasMore
  }

}
