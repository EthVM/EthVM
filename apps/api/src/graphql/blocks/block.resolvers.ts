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
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'

@Resolver('Block')
@UseInterceptors(SyncingInterceptor)
export class BlockResolvers {

  /**
   * @constant
   * @type {BigNumber}
   * @default
   */
  zeroBN = new BigNumber(0)

  constructor(
    private readonly blockService: BlockService,
    private readonly blockMetricsService: BlockMetricsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
  }

  /**
   * Get a page of block summaries.
   * @param {BigNumber} [blockNumber=latest block number] - Any blocks with a number higher than this will be ignored.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<BlockSummaryPageDto>} A page object with an array of block summaries and the total count (up to the given block number).
   */
  @Query()
  async blockSummaries(
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BlockSummaryPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid blocks to summarize.
      return new BlockSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.blockService.findSummaries(blockNumber, offset, limit)
    return new BlockSummaryPageDto(summaries, count)
  }

  /**
   * Get a page of block summaries by author.
   * @param {string} author - The author address hash to find blocks for.
   * @param {BigNumber} [blockNumber=latest block number] - Any blocks with a number higher than this will be ignored.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<BlockSummaryPageDto>} A page object with an array of block summaries for blocks mined by the author and the total count (up to the given
   * block number).
   */
  @Query()
  async blockSummariesByAuthor(
    @Args('author', ParseAddressPipe) author: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BlockSummaryByAuthorPageDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid blocks to summarize.
      return new BlockSummaryByAuthorPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.blockService.findSummariesByAuthor(author, blockNumber, offset, limit)
    return new BlockSummaryByAuthorPageDto(summaries, count)
  }

  /**
   * Get a block by its hash
   * @param {string} hash - The block hash to search by.
   * @param {BigNumber} [blockNumber=latest block number] - Any blocks with a number higher than this will be ignored.
   * @returns {Promise<BlockDto | undefined>} A block matching the hash if one is found, with tx fee info.
   */
  @Query()
  async blockByHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockDto | undefined> {

    if (!blockNumber) { // No latest block number was found so there are no valid blocks to search for.
      return undefined
    }

    // Find a block with the given hash.
    const entity = await this.blockService.findByHash(hash, blockNumber)

    if (!entity) return undefined

    // Find the tx fees for the block.
    const txFees = await this.blockMetricsService
      .findBlockMetricsTracesByHash(hash, entity.timestamp, entity.timestamp, true, blockNumber)

    return new BlockDto(entity, txFees)
  }

  /**
   * Get a block by its number
   * @param {string} number - The block number to search by.
   * @param {BigNumber} [blockNumber=latest block number] - Any blocks with a number higher than this will be ignored.
   * @returns {Promise<BlockDto | undefined>} A block matching the number if one is found, with tx fee info.
   */
  @Query()
  async blockByNumber(
    @Args('number') number: BigNumber,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BlockDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid blocks to search for.
      return undefined
    }

    // Find a block with the given number.
    const entity = await this.blockService.findByNumber(number, blockNumber)
    if (!entity) { return undefined }

    // Find the tx fees for the block.
    const txFees = await this.blockMetricsService
      .findBlockMetricsTracesByHash(entity.hash, entity.timestamp, entity.timestamp, true, blockNumber)

    return new BlockDto(entity, txFees)
  }

  /**
   * Get the latest hash rate.
   * @param {BigNumber} [blockNumber=latest block number] - Any blocks with a number higher than this will be ignored.
   * @returns {Promise<BigNumber | undefined>} The latest hash rate.
   */
  @Query('hashRate')
  async queryHashRate(@Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<BigNumber | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid blocks to calculate the hash rate from.
      return undefined
    }
    return this.blockService.calculateHashRate(true, blockNumber)
  }

  /**
   * Subscribe to new block notifications.
   */
  @Subscription(
    'newBlock', {
      resolve: (summary: BlockSummary) => new BlockSummaryDto(summary),
    } as SubscriptionOptions)
  newBlock() {
    return this.pubSub.asyncIterator('newBlock')
  }

  /**
   * Subscribe to new hash rate notifications.
   */
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
