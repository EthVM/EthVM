import { BlockSummaryPageExt_items } from '@app/core/api/apollo/extensions/block-summary-page.ext'
import { BlockSummaryByAuthorPage } from '@app/core/api/apollo/types/BlockSummaryByAuthorPage'

export class BlockSummaryByAuthorPageExt implements BlockSummaryByAuthorPage {
  __typename!: 'BlockSummaryByAuthorPage'
  items: BlockSummaryPageExt_items[]
  hasMore!: boolean

  constructor(proto: BlockSummaryByAuthorPage) {
    this.items = proto.items!.map(s => new BlockSummaryPageExt_items(s))
    this.hasMore = proto.hasMore
  }
}
