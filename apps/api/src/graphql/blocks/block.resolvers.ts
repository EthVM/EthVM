import { BlockService } from '@app/dao/block.service'
import { BlockDto } from '@app/graphql/blocks/dto/block.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { Inject, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { BlockSummary } from '../schema'
import { BlockSummaryDto } from './dto/block-summary.dto'
import BigNumber from 'bignumber.js'
import { BlockSummaryPageDto } from './dto/block-summary-page.dto'
import retry from 'async-retry'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'

@Resolver('Block')
@UseInterceptors(SyncingInterceptor)
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

    return retry(async bail => {

      try {
        const [summaries, count] = await this.blockService.findSummaries(offset, limit, fromBlock)
        return new BlockSummaryPageDto(summaries, count)
      } catch (err) {

        if (err instanceof PartialReadException) {
          // re-throw for retry
          throw err
        } else {
          bail(err)
        }

      }
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    })

  }

  @Query()
  async blockSummariesByAuthor(
    @Args('author', ParseAddressPipe) author: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BlockSummaryPageDto | undefined> {
    return retry(async bail => {

      try {
        const [summaries, count] = await this.blockService.findSummariesByAuthor(author, offset, limit)
        return new BlockSummaryPageDto(summaries, count)
      } catch (err) {

        if (err instanceof PartialReadException) {
          // re-throw for retry
          throw err
        } else {
          bail(err)
        }

      }
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    })
  }

  @Query()
  async blockByHash(@Args('hash', ParseHashPipe) hash: string) {

    return retry(async bail => {

      try {
        const entity = await this.blockService.findByHash(hash)
        return entity ? new BlockDto(entity) : null
      } catch (err) {

        if (err instanceof PartialReadException) {
          // re-throw for retry
          throw err
        } else {
          bail(err)
        }

      }
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    })
  }

  @Query()
  async blockByNumber(@Args('number') number: BigNumber) {
    return retry(async bail => {

      try {
        const entity = await this.blockService.findByNumber(number)
        return entity ? new BlockDto(entity) : null
      } catch (err) {

        if (err instanceof PartialReadException) {
          // re-throw for retry
          throw err
        } else {
          bail(err)
        }

      }
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    })
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

}
