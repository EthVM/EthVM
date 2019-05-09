import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import { BlockMetricsService } from '@app/dao/block-metrics.service'
import { BlockMetricField, BlockMetricPage, TimeBucket } from '@app/graphql/schema'
import { BlockMetricPageDto } from '@app/graphql/block-metrics/dto/block-metric-page.dto'
import { BlockMetricDto } from '@app/graphql/block-metrics/dto/block-metric.dto'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { AggregateBlockMetricDto } from '@app/graphql/block-metrics/dto/aggregate-block-metric.dto'

@Resolver('BlockMetric')
export class BlockMetricsResolvers {

  constructor(private readonly blockMetricsService: BlockMetricsService,
              @Inject('PUB_SUB') private pubSub: PubSub) {
  }

  @Query()
  async blockMetrics(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BlockMetricPage> {
    const [items, count] = await this.blockMetricsService.find(offset, limit)
    return new BlockMetricPageDto(offset, limit, items, count)
  }

  @Query()
  async blockMetricsTimeseries(
    @Args('start') start: Date,
    @Args('end') end: Date,
    @Args('bucket') bucket: TimeBucket,
    @Args({name: 'fields', type: () => [BlockMetricField]}) fields: BlockMetricField[],
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
}
