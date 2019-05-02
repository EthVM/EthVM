import {Args, Query, Resolver, Subscription, SubscriptionOptions} from '@nestjs/graphql'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {DurationService} from '@app/shared/duration.service'
import {AggregateBlockMetricPage, BlockMetricPage, TimeBucket} from '@app/graphql/schema'
import {BlockMetricPageDto} from '@app/graphql/block-metrics/dto/block-metric-page.dto'
import {BlockMetricDto} from '@app/graphql/block-metrics/dto/block-metric.dto'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import {Inject} from '@nestjs/common'
import {PubSub} from 'graphql-subscriptions'
import {AggregateBlockMetricPageDto} from '@app/graphql/block-metrics/dto/aggregate-block-metric-page.dto'
import {ParseDatePipe} from '@app/shared/validation/parse-date.pipe.1'

@Resolver('BlockMetric')
export class BlockMetricsResolvers {

  constructor(private readonly blockMetricsService: BlockMetricsService,
              @Inject('PUB_SUB') private pubSub: PubSub,
              private readonly durationService: DurationService) {
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
  async aggregateBlockMetrics(
    @Args('start', ParseDatePipe) start: Date,
    @Args('end', ParseDatePipe) end: Date,
    @Args('bucket') bucket: TimeBucket,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<AggregateBlockMetricPageDto> {
    const [items, count] = await this.blockMetricsService.aggregate(start, end, bucket, offset, limit)
    return new AggregateBlockMetricPageDto(offset, limit, items, count)
  }

  @Subscription(
    'newBlockMetric', {
      resolve: (summary: BlockMetricEntity) => new BlockMetricDto(summary),
    } as SubscriptionOptions)
  newBlockMetric() {
    return this.pubSub.asyncIterator('newBlockMetric')
  }
}
