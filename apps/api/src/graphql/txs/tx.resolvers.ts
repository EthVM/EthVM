import { TxService } from '@app/dao/tx.service'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import BigNumber from 'bignumber.js'
import { TransactionSummaryPageDto } from '@app/graphql/txs/dto/transaction-summary-page.dto'
import { PubSub } from 'graphql-subscriptions'
import { Inject } from '@nestjs/common'
import { TransactionSummaryDto } from '@app/graphql/txs/dto/transaction-summary.dto'
import { TransactionSummary } from '@app/graphql/schema'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import retry from 'async-retry'

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
    return retry(async bail => {

      try {
        const [summaries, count] = await this.txService.findSummaries(offset, limit, fromBlock)
        return new TransactionSummaryPageDto(summaries, count)
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
      minTimeout: 500
    })
  }

  @Query()
  async transactionSummariesForBlockNumber(
    @Args('number') number: number,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    return retry(async bail => {

      try {
        const [summaries, count] = await this.txService.findSummariesByBlockNumber(number, offset, limit)
        return new TransactionSummaryPageDto(summaries, count)
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
      minTimeout: 500
    })
  }

  @Query()
  async transactionSummariesForBlockHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    return retry(async bail => {

      try {
        const [summaries, count] = await this.txService.findSummariesByBlockHash(hash, offset, limit)
        return new TransactionSummaryPageDto(summaries, count)
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
      minTimeout: 500
    })
  }

  @Query()
  async transactionSummariesForAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('filter') filter: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TransactionSummaryPageDto> {
    return retry(async bail => {

      try {
        const [summaries, count] = await this.txService.findSummariesByAddress(address, filter, offset, limit)
        return new TransactionSummaryPageDto(summaries, count)
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
      minTimeout: 500
    })
  }

  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string): Promise<TxDto | null> {
    return retry(async bail => {

      try {
        const entity = await this.txService.findOneByHash(hash)
        return entity ? new TxDto(entity) : null
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
      minTimeout: 500
    })
  }

  @Subscription(
    'newTransaction', {
      resolve: (summary: TransactionSummary) => new TransactionSummaryDto(summary),
    } as SubscriptionOptions)
  newTransaction() {
    return this.pubSub.asyncIterator('newTransaction')
  }
}
