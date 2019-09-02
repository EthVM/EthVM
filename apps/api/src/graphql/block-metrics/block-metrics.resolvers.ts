import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import { BlockMetricsService } from '@app/dao/block-metrics.service'
import {
  BlockMetricField,
  TimeBucket,
} from '@app/graphql/schema'
import { BlockMetricDto } from '@app/graphql/block-metrics/dto/block-metric.dto'
import { Inject, UseInterceptors } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { AggregateBlockMetricDto } from '@app/graphql/block-metrics/dto/aggregate-block-metric.dto'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';
import BigNumber from 'bignumber.js';
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity';
import {BlockMetricsTraceEntity} from '@app/orm/entities/block-metrics-trace.entity';
import {BlockMetricsTraceDto} from '@app/graphql/block-metrics/dto/block-metrics-trace.dto';
import {BlockMetricsPageDto} from '@app/graphql/block-metrics/dto/block-metrics-page.dto';
import {BalancePageDto} from '@app/graphql/balances/dto/balance-page.dto';

@Resolver('BlockMetric')
@UseInterceptors(SyncingInterceptor)
export class BlockMetricsResolvers {

  constructor(private readonly blockMetricsService: BlockMetricsService,
              @Inject('PUB_SUB') private pubSub: PubSub) {
  }

  @Query()
  async blockMetrics(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockMetricsPageDto> {

    if (!blockNumber) { // There is no data
      return new BlockMetricsPageDto(0, 0, [], 0)
    }

    const [items, count] = await this.blockMetricsService.findBlockMetrics(offset, limit, blockNumber)
    return new BlockMetricsPageDto(offset, limit, items, count)
  }

  @Query()
  async blockMetricsTimeseries(
    @Args('bucket') bucket: TimeBucket,
    @Args('field') field: BlockMetricField,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('start') start?: Date,
    @Args('end') end?: Date,
  ): Promise<AggregateBlockMetricDto[]> {
    if (!blockNumber) { // There is no data
      return []
    }
    const entities = await this.blockMetricsService.timeseries(bucket, field, blockNumber, start, end)
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
    'newBlockMetricsTrace', {
      resolve: (summary: BlockMetricsTraceEntity) => new BlockMetricsTraceDto(summary),
    } as SubscriptionOptions)
  newBlockMetricsTrace() {
    return this.pubSub.asyncIterator('newBlockMetricsTrace')
  }

}
