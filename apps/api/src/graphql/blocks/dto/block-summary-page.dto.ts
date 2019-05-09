import { BlockSummary, BlockSummaryPage } from '@app/graphql/schema'
import { BlockSummaryDto } from '@app/graphql/blocks/dto/block-summary.dto'

export class BlockSummaryPageDto implements BlockSummaryPage {

  items: BlockSummaryDto[]
  totalCount: number

  constructor(items: BlockSummary[], totalCount: number) {
    this.items = items.map(s => new BlockSummaryDto(s))
    this.totalCount = totalCount
  }

}
