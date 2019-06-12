import { BlockMetricDto } from '@app/graphql/block-metrics/dto/block-metric.dto'
import { BlockMetricsTransactionDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction.dto'
import { BlockMetricsTransactionPage } from '@app/graphql/schema'
import { BlockMetricsTransactionEntity } from '@app/orm/entities/block-metrics-transaction.entity'

export class BlockMetricsTransactionPageDto implements BlockMetricsTransactionPage {

  items: BlockMetricsTransactionDto[]
  offset: number
  limit: number
  totalCount: number

  constructor(offset: number, limit: number, items: BlockMetricsTransactionEntity[], totalCount: number) {
    this.offset = offset
    this.limit = limit
    this.items = items.map(i => new BlockMetricDto(i))
    this.totalCount = totalCount
  }

}
