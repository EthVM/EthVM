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

  /**
   * @constant
   * @type {BigNumber}
   * @default
   */
  zeroBN = new BigNumber(0)

  constructor(
    private readonly txService: TxService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) { }

  /**
   * Get a page of tx summaries.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any txs with a block number higher than this will be ignored.
   * @returns {Promise<TransactionSummaryPageDto>} A page object with an array of tx summaries and the total count.
   */
  @Query()
  async transactionSummaries(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TransactionSummaryPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid txs to summarize.
      return new TransactionSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.txService.findSummaries(offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  /**
   * Get a page of tx summaries for a given block number.
   * @param {BigNumber} number - The block number to filter txs by.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any txs with a block number higher than this will be ignored.
   * @returns {Promise<TransactionSummaryPageDto>} A page object with an array of tx summaries and the total count.
   */
  @Query()
  async transactionSummariesForBlockNumber(
    @Args('number') number: BigNumber,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TransactionSummaryPageDto> {
    if (!blockNumber) {  // No latest block number was found so there are no valid txs to summarize.
      return new TransactionSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.txService.findSummariesByBlockNumber(number, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  /**
   * Get a page of tx summaries for a given block hash.
   * @param {string} hash - The block hash to filter txs by.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any txs with a block number higher than this will be ignored.
   * @returns {Promise<TransactionSummaryPageDto>} A page object with an array of tx summaries and the total count.
   */
  @Query()
  async transactionSummariesForBlockHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TransactionSummaryPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid txs to summarize.
      return new TransactionSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.txService.findSummariesByBlockHash(hash, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  /**
   * Get a page of tx summaries for a given address.
   * @param {string} address - The address hash to filter by.
   * @param {FilterEnum} filter - A directional filter (in, out or all).
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any txs with a block number higher than this will be ignored.
   * @returns {Promise<TransactionSummaryPageDto>} A page object with an array of tx summaries and the total count.
   */
  @Query()
  async transactionSummariesForAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('filter') filter: FilterEnum,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TransactionSummaryPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid txs to summarize.
      return new TransactionSummaryPageDto([], this.zeroBN)
    }
    const [summaries, count] = await this.txService.findSummariesByAddress(address, filter, offset, limit, blockNumber)
    return new TransactionSummaryPageDto(summaries, count)
  }

  /**
   * Get a tx by its hash.
   * @param {string} hash - The tx hash.
   * @param {BigNumber} [blockNumber=latest block number] - Any txs with a block number higher than this will be ignored.
   * @returns {Promise<TxDto | undefined>}
   */
  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string, @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<TxDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid txs.
      return undefined
    }
    const entity = await this.txService.findOneByHash(hash, blockNumber)
    return entity ? new TxDto(entity) : undefined
  }

  /**
   * Subscribe to new transaction notifications.
   */
  @Subscription(
    'newTransaction', {
      resolve: (summary: TransactionSummary) => new TransactionSummaryDto(summary),
    } as SubscriptionOptions)
  newTransaction() {
    return this.pubSub.asyncIterator('newTransaction')
  }

  /**
   * Subscribe to new transactions notifications.
   */
  @Subscription(
    'newTransactions', {
      resolve: (summaries: TransactionSummary[]) => summaries.map(s => new TransactionSummaryDto(s)),
    } as SubscriptionOptions)
  newTransactions() {
    return this.pubSub.asyncIterator('newTransactions')
  }
}
