import { BlockSummary, BlockSummaryByAuthorPage } from '@app/graphql/schema'
import { BlockSummaryDto } from '@app/graphql/blocks/dto/block-summary.dto'
import BigNumber from 'bignumber.js'

export class BlockSummaryByAuthorPageDto implements BlockSummaryByAuthorPage {

  items: BlockSummaryDto[]
  totalCount: BigNumber

  constructor(items: BlockSummary[], totalCount: BigNumber) {
    this.items = items.map(s => new BlockSummaryDto(s))
    this.totalCount = totalCount
  }

}
