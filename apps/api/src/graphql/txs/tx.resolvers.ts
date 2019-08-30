import { TxService } from '@app/dao/tx.service'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'
import { ParseAddressPipe } from '@app/shared/pipes/parse-address.pipe'
import { ParseHashPipe } from '@app/shared/pipes/parse-hash.pipe'
import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import BigNumber from 'bignumber.js'
import { TransactionSummaryPageDto } from '@app/graphql/txs/dto/transaction-summary-page.dto'
import { PubSub } from 'graphql-subscriptions'
import { Inject, UseInterceptors } from '@nestjs/common'
import { TransactionSummaryDto } from '@app/graphql/txs/dto/transaction-summary.dto'
import {FilterEnum, TransactionSummary} from '@app/graphql/schema'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'

@Resolver('Transaction')
@UseInterceptors(SyncingInterceptor)
export class TxResolvers {
  constructor(
    private readonly txService: TxService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) { }

  @Query()
  async transactionSummaries(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ) {
    const [summaries, count] = await this.txService.findSummaries(offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForBlockNumber(
    @Args('number') number: BigNumber,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ) {
    const [summaries, count] = await this.txService.findSummariesByBlockNumber(number, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForBlockHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ) {
    const [summaries, count] = await this.txService.findSummariesByBlockHash(hash, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('filter') filter: FilterEnum,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TransactionSummaryPageDto | undefined> {
    const [summaries, count] = await this.txService.findSummariesByAddress(address, filter, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string, @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<TxDto | undefined> {
    const entity = await this.txService.findOneByHash(hash, blockNumber)
    return entity ? new TxDto(entity) : undefined
  }

  @Subscription(
    'newTransaction', {
      resolve: (summary: TransactionSummary) => new TransactionSummaryDto(summary),
    } as SubscriptionOptions)
  newTransaction() {
    return this.pubSub.asyncIterator('newTransaction')
  }

  @Subscription(
    'newTransactions', {
      resolve: (summaries: TransactionSummary[]) => summaries.map(s => new TransactionSummaryDto(s)),
    } as SubscriptionOptions)
  newTransactions() {
    return this.pubSub.asyncIterator('newTransactions')
  }
}
