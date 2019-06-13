import { BlockMetricsTransactionFeePage } from '@app/graphql/schema'
import { BlockMetricsTransactionFeeDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction-fee.dto'
import { BlockMetricsTransactionFeeEntity } from '@app/orm/entities/block-metrics-transaction-fee.entity'

export class BlockMetricsTransactionFeePageDto implements BlockMetricsTransactionFeePage {

  items: BlockMetricsTransactionFeeDto[]
  offset: number
  limit: number
  totalCount: number

  constructor(offset: number, limit: number, items: BlockMetricsTransactionFeeEntity[], totalCount: number) {
    this.offset = offset
    this.limit = limit
    this.items = items.map(i => new BlockMetricsTransactionFeeDto(i))
    this.totalCount = totalCount
  }

}
