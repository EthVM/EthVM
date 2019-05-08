import {BlockMetricPage} from '@app/graphql/schema'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import {BlockMetricDto} from '@app/graphql/block-metrics/dto/block-metric.dto'

export class BlockMetricPageDto extends BlockMetricPage {

  constructor(offset: number, limit: number, items: BlockMetricEntity[], totalCount: number) {
    super()

    this.offset = offset
    this.limit = limit
    this.items = items.map(i => new BlockMetricDto(i))
    this.totalCount = totalCount

  }

}
