import { BlockMetricPage } from '../../../../../../api/src/graphql/schema'
import { BlockMetricExt } from '@app/core/api/apollo/extensions/block-metric.ext'
import BigNumber from 'bignumber.js'

export class BlockMetricPageExt implements BlockMetricPage {
  items: BlockMetricExt[]
  limit: number
  offset: number
  totalCount: BigNumber

  constructor(proto: BlockMetricPage) {
    this.offset = proto.offset
    this.limit = proto.limit
    this.totalCount = proto.totalCount
    if (proto.items) {
      this.items = proto.items!.map(i => new BlockMetricExt(i))
    }
  }
}
