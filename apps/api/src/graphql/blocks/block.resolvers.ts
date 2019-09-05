import {BlockService} from '@app/dao/block.service'
import {BlockDto} from '@app/graphql/blocks/dto/block.dto'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {ParseHashPipe} from '@app/shared/pipes/parse-hash.pipe'
import {Inject, UseInterceptors} from '@nestjs/common'
import {Args, Query, Resolver, Subscription, SubscriptionOptions} from '@nestjs/graphql'
import {PubSub} from 'graphql-subscriptions'
import {BlockSummary} from '../schema'
import {BlockSummaryDto} from './dto/block-summary.dto'
import BigNumber from 'bignumber.js'
import {BlockSummaryPageDto} from './dto/block-summary-page.dto'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {BlockSummaryByAuthorPageDto} from '@app/graphql/blocks/dto/block-summary-by-author-page.dto'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Block')
@UseInterceptors(SyncingInterceptor)
export class BlockResolvers {

  zeroBN = new BigNumber(0)

  constructor(
    private readonly blockService: BlockService,
    private readonly blockMetricsService: BlockMetricsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
  }

  @Query()
  async blockSummaries(
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BlockSummaryPageDto> {
    if (!blockNumber) { // There is no data
      return new BlockSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.blockService.findSummaries(blockNumber, offset, limit)
    return new BlockSummaryPageDto(summaries, count)
  }

  @Query()
  async blockSummariesByAuthor(
    @Args('author', ParseAddressPipe) author: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BlockSummaryByAuthorPageDto | undefined> {
    if (!blockNumber) { // There is no data
      return new BlockSummaryByAuthorPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.blockService.findSummariesByAuthor(author, blockNumber, offset, limit)
    return new BlockSummaryByAuthorPageDto(summaries, count)
  }

  @Query()
  async blockByHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockDto | undefined> {

    if (!blockNumber) { // There is no data
      return undefined
    }

    const entity = await this.blockService.findByHash(hash, blockNumber)

    if (!entity) return undefined

    // Convert Date to seconds for some reason
    const timestamp =  new Date(entity.timestamp.getTime() / 1000)

    const txFees = await this.blockMetricsService
      .findBlockMetricsTracesByHash(hash, timestamp, timestamp, true, blockNumber)
    return new BlockDto(entity, txFees)
  }

  @Query()
  async blockByNumber(
    @Args('number') number: BigNumber,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockDto | undefined> {
    if (!blockNumber) { // There is no data
      return undefined
    }
    const entity = await this.blockService.findByNumber(number, blockNumber)
    if (!entity) { return undefined }

    // Convert Date to seconds for some reason
    const timestamp =  new Date(entity.timestamp.getTime() / 1000)

    const txFees = await this.blockMetricsService
      .findBlockMetricsTracesByHash(entity.hash, timestamp, timestamp, true, blockNumber)
    return new BlockDto(entity, txFees)
  }

  @Query('hashRate')
  async queryHashRate(@Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<BigNumber | undefined> {
    if (!blockNumber) { // There is no data
      return undefined
    }
    return this.blockService.calculateHashRate(true, blockNumber)
  }

  @Subscription(
    'newBlock', {
      resolve: (summary: BlockSummary) => new BlockSummaryDto(summary),
    } as SubscriptionOptions)
  newBlock() {
    return this.pubSub.asyncIterator('newBlock')
  }

  @Subscription(
    'hashRate', {
      // TODO determine why we need to specify the resolve function for this to work
      resolve: (hashRate: BigNumber) => hashRate,
    } as SubscriptionOptions,
  )
  hashRate() {
    return this.pubSub.asyncIterator('hashRate')
  }

}
