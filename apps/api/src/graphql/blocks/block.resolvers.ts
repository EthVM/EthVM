import { BlockService } from '@app/dao/block.service';
import { BlockDto } from '@app/graphql/blocks/dto/block.dto';
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe';
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe';
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe.1';
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe';
import {Inject, ParseIntPipe} from '@nestjs/common';
import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {BlockSummary} from '../schema';
import { BlockSummaryDto } from './dto/block-summary.dto';
import BigNumber from 'bignumber.js';
import {BlocksPageDto} from '@app/graphql/blocks/dto/blocks-page.dto'
import {BlockSummaryPageDto} from './dto/block-summary-page.dto'

@Resolver('Block')
export class BlockResolvers {

  constructor(
    private readonly blockService: BlockService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
  }

  @Query()
  async blockSummaries(
    @Args('fromBlock') fromBlock: BigNumber,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    const [summaries, count] = await this.blockService.findSummaries(offset, limit, fromBlock)
    return new BlockSummaryPageDto(summaries, count)
  }

  @Query()
  async blocks(
    @Args('page', ParsePagePipe) page: number,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('fromBlock') fromBlock?: number,
  ) {
    const entities = await this.blockService.findBlocks(limit, page, fromBlock)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async blockByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.blockService.findBlockByHash(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async blockByNumber(@Args('number') number: BigNumber) {
    const entity = await this.blockService.findBlockByNumber(number)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async minedBlocksByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<BlocksPageDto> {
    const result = await this.blockService.findMinedBlocksByAddress(address, limit, page)
    return new BlocksPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async totalNumberOfBlocks() {
    return this.blockService.findTotalNumberOfBlocks()
  }

  @Query('hashRate')
  async queryHashRate(): Promise<BigNumber | null> {
    return this.blockService.calculateHashRate()
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

  @Subscription()
  isSyncing() {
    return this.pubSub.asyncIterator('isSyncing')
  }

}
