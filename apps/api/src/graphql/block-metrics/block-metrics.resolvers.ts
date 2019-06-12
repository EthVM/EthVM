import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import { BlockMetricsService } from '@app/dao/block-metrics.service'
import {
  BlockMetricField,
  BlockMetricsTransactionFeePage,
  BlockMetricsTransactionPage,
  TimeBucket,
} from '@app/graphql/schema'
import { BlockMetricDto } from '@app/graphql/block-metrics/dto/block-metric.dto'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'
import { Inject, UseInterceptors } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { AggregateBlockMetricDto } from '@app/graphql/block-metrics/dto/aggregate-block-metric.dto'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { BlockMetricsTransactionPageDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction-page.dto'
import { BlockMetricsTransactionFeePageDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction-fee-page.dto'
import { BlockMetricsTransactionDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction.dto'
import { BlockMetricsTransactionEntity } from '@app/orm/entities/block-metrics-transaction.entity'
import { BlockMetricsTransactionFeeEntity } from '@app/orm/entities/block-metrics-transaction-fee.entity'
import { BlockMetricsTransactionFeeDto } from '@app/graphql/block-metrics/dto/block-metrics-transaction-fee.dto'

@Resolver('BlockMetric')
@UseInterceptors(SyncingInterceptor)
export class BlockMetricsResolvers {

  constructor(private readonly blockMetricsService: BlockMetricsService,
              @Inject('PUB_SUB') private pubSub: PubSub) {
  }

  @Query()
  async blockMetricsTransaction(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BlockMetricsTransactionPage> {
    const [items, count] = await this.blockMetricsService.findBlockMetricsTransaction(offset, limit)
    return new BlockMetricsTransactionPageDto(offset, limit, items, count)
  }

  @Query()
  async blockMetricsTransactionFee(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BlockMetricsTransactionFeePage> {
    const [items, count] = await this.blockMetricsService.findBlockMetricsTransactionFee(offset, limit)
    return new BlockMetricsTransactionFeePageDto(offset, limit, items, count)
  }

  @Query()
  async blockMetricsTimeseries(
    @Args('start') start: Date,
    @Args('end') end: Date,
    @Args('bucket') bucket: TimeBucket,
    @Args({ name: 'fields', type: () => [BlockMetricField] }) fields: BlockMetricField[],
  ): Promise<AggregateBlockMetricDto[]> {
    const entities = await this.blockMetricsService.timeseries(start, end, bucket, fields)
    return entities.map(e => new AggregateBlockMetricDto(e))
  }

  @Subscription(
    'newBlockMetric', {
      resolve: (summary: BlockMetricEntity) => new BlockMetricDto(summary),
    } as SubscriptionOptions)
  newBlockMetric() {
    return this.pubSub.asyncIterator('newBlockMetric')
  }

  @Subscription(
    'newBlockMetricsTransaction', {
      resolve: (summary: BlockMetricsTransactionEntity) => new BlockMetricsTransactionDto(summary),
    } as SubscriptionOptions)
  newBlockMetricsTransaction() {
    return this.pubSub.asyncIterator('newBlockMetricsTransaction')
  }

  @Subscription(
    'newBlockMetricsTransactionFee', {
      resolve: (summary: BlockMetricsTransactionFeeEntity) => new BlockMetricsTransactionFeeDto(summary),
    } as SubscriptionOptions)
  newBlockMetricsTransactionFee() {
    return this.pubSub.asyncIterator('newBlockMetricsTransactionFee')
  }

}
