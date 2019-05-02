import {AggregateBlockMetric, AggregateBlockMetricPage, BlockMetricPage} from '@app/graphql/schema'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import {BlockMetricDto} from '@app/graphql/block-metrics/dto/block-metric.dto'
import {AggregateBlockMetricDto} from '@app/graphql/block-metrics/dto/aggregate-block-metric.dto'

export class AggregateBlockMetricPageDto extends AggregateBlockMetricPage {

  constructor(offset: number, limit: number, items: AggregateBlockMetric[], totalCount: number) {
    super()

    this.offset = offset
    this.limit = limit
    this.items = items.map(i => new AggregateBlockMetricDto(i))
    this.totalCount = totalCount

  }

}
