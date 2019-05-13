import {TxService} from '@app/dao/tx.service';
import {TxDto} from '@app/graphql/txs/dto/tx.dto';
import {ParseAddressPipe} from '@app/shared/validation/parse-address.pipe';
import {ParseBigNumberPipe} from '@app/shared/validation/parse-big-number.pipe';
import {ParseHashPipe} from '@app/shared/validation/parse-hash.pipe';
import {ParseLimitPipe} from '@app/shared/validation/parse-limit.pipe.1';
import {ParsePagePipe} from '@app/shared/validation/parse-page.pipe';
import {Args, Query, Resolver, Subscription, SubscriptionOptions} from '@nestjs/graphql';
import BigNumber from 'bignumber.js';
import {TransactionSummaryPageDto} from '@app/graphql/txs/dto/transaction-summary-page.dto';
import {PubSub} from 'graphql-subscriptions';
import {Inject} from '@nestjs/common';
import {TransactionSummaryDto} from '@app/graphql/txs/dto/transaction-summary.dto';
import {TransactionSummary} from '@app/graphql/schema';

@Resolver('Transaction')
export class TxResolvers {
  constructor(
    private readonly txService: TxService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) { }

  @Query()
  async transactionSummaries(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('fromBlock') fromBlock?: BigNumber,
  ) {
    const [summaries, count] = await this.txService.findSummaries(offset, limit, fromBlock)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForBlockNumber(
    @Args('number') number: number,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    const [summaries, count] = await this.txService.findSummariesByBlockNumber(number, offset, limit)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForBlockHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    const [summaries, count] = await this.txService.findSummariesByBlockHash(hash, offset, limit)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async transactionSummariesForAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('filter') filter: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TransactionSummaryPageDto> {
    const [summaries, count] = await this.txService.findSummariesByAddress(address, filter, offset, limit)
    return new TransactionSummaryPageDto(summaries, count)
  }

  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string): Promise<TxDto | null> {
    const entity = await this.txService.findOneByHash(hash)
    return entity ? new TxDto(entity) : null
  }

  @Query()
  async txs(
    @Args('limit') limit: number,
    @Args('page') page: number,
    @Args('fromBlock', ParseBigNumberPipe) fromBlock?: BigNumber,
  ): Promise<TxDto[]> {
    const entities = await this.txService.find(limit, page, fromBlock)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async txsForAddress(
    @Args('hash', ParseAddressPipe) hash: string,
    @Args('filter') filter: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TxDto[]> {
    const entities = await this.txService.findByAddress(hash, filter, limit, page)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async totalNumberOfTransactions(): Promise<number> {
    return await this.txService.countTransactions()
  }
  @Subscription(
    'newTransaction', {
      resolve: (summary: TransactionSummary) => new TransactionSummaryDto(summary),
    } as SubscriptionOptions)
  newTransaction() {
    return this.pubSub.asyncIterator('newTransaction')
  }
}
