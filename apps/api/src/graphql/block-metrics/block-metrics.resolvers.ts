import {Args, Query, Resolver, Subscription, SubscriptionOptions} from '@nestjs/graphql'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {BlockMetricField, TimeBucket} from '@app/graphql/schema'
import {BlockMetricDto} from '@app/graphql/block-metrics/dto/block-metric.dto'
import {Inject, UseInterceptors} from '@nestjs/common'
import {PubSub} from 'graphql-subscriptions'
import {AggregateBlockMetricDto} from '@app/graphql/block-metrics/dto/aggregate-block-metric.dto'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'
import BigNumber from 'bignumber.js'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import {BlockMetricsPageDto} from '@app/graphql/block-metrics/dto/block-metrics-page.dto'

@Resolver('BlockMetric')
@UseInterceptors(SyncingInterceptor)
export class BlockMetricsResolvers {

  constructor(private readonly blockMetricsService: BlockMetricsService,
              @Inject('PUB_SUB') private pubSub: PubSub) {
  }

  /**
   * Get a page of block metrics.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any block metrics for a block number higher than this will be ignored.
   * @returns {Promise<BlockMetricsPageDto>} A page object with an array of block metrics, the offset, the limit and the total count.
   */
  @Query()
  async blockMetrics(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockMetricsPageDto> {

    if (!blockNumber) { // No latest block number was found so there are no valid block metrics to return.
      return new BlockMetricsPageDto(offset, limit, [], 0)
    }

    const [items, count] = await this.blockMetricsService.findBlockMetrics(offset, limit, blockNumber)
    return new BlockMetricsPageDto(offset, limit, items, count)
  }

  /**
   * Get aggregated block metrics.
   * @param {TimeBucket} bucket - The length of time by which to aggregate the block metrics.
   * @param {BlockMetricField} field - The block metric object field for which to aggregate the block metrics.
   * @param {BigNumber} [blockNumber=latest block number] - Any block metrics for a block number higher than this will be ignored.
   * @param {Date} [start] - The start date for the aggregation.
   * @param {Date} [end] - The end date for the aggregation.
   * @returns {Promise<AggregateBlockMetricDto[]>} Array of aggregated block metrics.
   */
  @Query()
  async blockMetricsTimeseries(
    @Args('bucket') bucket: TimeBucket,
    @Args('field') field: BlockMetricField,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('start') start?: Date,
    @Args('end') end?: Date,
  ): Promise<AggregateBlockMetricDto[]> {

    if (!blockNumber) { // No latest block number was found so there are no valid block metrics to aggregate.
      return []
    }
    const entities = await this.blockMetricsService.timeseries(bucket, field, blockNumber, start, end)
    return entities.map(e => new AggregateBlockMetricDto(e))
  }

  /**
   * Subscribe to new block metric notifications.
   */
  @Subscription(
    'newBlockMetric', {
      resolve: (summary: BlockMetricEntity) => new BlockMetricDto(summary),
    } as SubscriptionOptions)
  newBlockMetric() {
    return this.pubSub.asyncIterator('newBlockMetric')
  }

}
