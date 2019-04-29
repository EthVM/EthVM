import {BlockService} from '@app/dao/block.service'
import {BlockDto} from '@app/graphql/blocks/dto/block.dto'
import {ParseAddressPipe} from '@app/shared/validation/parse-address.pipe'
import {ParseHashPipe} from '@app/shared/validation/parse-hash.pipe'
import {ParsePagePipe} from '@app/shared/validation/parse-page.pipe'
import {Inject} from '@nestjs/common'
import {Args, Query, Resolver, Subscription, SubscriptionOptions} from '@nestjs/graphql'
import {PubSub} from 'graphql-subscriptions'

import {BlockSummaryDto} from './dto/block-summary.dto'
import {BlocksPageDto} from '@app/graphql/blocks/dto/blocks-page.dto'
import {ParseLimitPipe} from '@app/shared/validation/parse-limit.pipe.1'
import {BlockSummaryPageDto} from './dto/block-summary-page.dto'
import {BlockSummary} from '@app/graphql/schema'

@Resolver('Block')
export class BlockResolvers {

  constructor(
    private readonly blockService: BlockService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
  }

  @Query()
  async blockSummaries(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    const [summaries, count] = await this.blockService.findSummaries(offset, limit)
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
    const entity = await this.blockService.findOneByBlockHash(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async blockByNumber(@Args('number') number: number) {
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
    return await this.blockService.findTotalNumberOfBlocks()
  }

  @Subscription(
    'newBlock', {
      resolve: (summary: BlockSummary) => new BlockSummaryDto(summary),
    } as SubscriptionOptions)
  newBlock() {
    return this.pubSub.asyncIterator('newBlock')
  }

  @Subscription()
  isSyncing() {
    return this.pubSub.asyncIterator('isSyncing')
  }

}
