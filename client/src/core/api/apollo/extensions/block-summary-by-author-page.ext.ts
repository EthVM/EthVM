import { BlockSummaryPageExt_items } from '@app/core/api/apollo/extensions/block-summary-page.ext'
import { BlockSummaryByAuthorPage } from '@app/core/api/apollo/types/BlockSummaryByAuthorPage'
import BigNumber from 'bignumber.js'

export class BlockSummaryByAuthorPageExt implements BlockSummaryByAuthorPage {
  __typename!: 'BlockSummaryByAuthorPage'
  items: BlockSummaryPageExt_items[]
  totalCount!: any

  constructor(proto: BlockSummaryByAuthorPage) {
    this.items = proto.items!.map(s => new BlockSummaryPageExt_items(s))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BigNumber {
    return new BigNumber(this.totalCount)
  }
}
