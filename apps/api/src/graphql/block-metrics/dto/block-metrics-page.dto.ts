import {BlockMetricsPage} from '@app/graphql/schema';
import {BlockMetricDto} from '@app/graphql/block-metrics/dto/block-metric.dto';
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity';

export class BlockMetricsPageDto implements BlockMetricsPage {

  items: BlockMetricDto[]
  offset: number
  limit: number
  totalCount: number

  constructor(offset: number, limit: number, items: BlockMetricEntity[], totalCount: number) {
    this.offset = offset
    this.limit = limit
    this.items = items.map(i => new BlockMetricDto(i))
    this.totalCount = totalCount
  }

}
