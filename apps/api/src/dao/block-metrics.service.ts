import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager, In } from 'typeorm'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'
import { AggregateBlockMetric, BlockMetricField, TimeBucket } from '@app/graphql/schema'
import { unitOfTime } from 'moment'
import { RowCount } from '@app/orm/entities/row-counts.entity'
import { BlockMetricsTransactionFeeEntity } from '@app/orm/entities/block-metrics-transaction-fee.entity'
import { BlockMetricsTransactionEntity } from '@app/orm/entities/block-metrics-transaction.entity'
import moment = require('moment')

@Injectable()
export class BlockMetricsService {

  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {
  }

  async findByBlockHash(blockHashes: string[]): Promise<BlockMetricEntity[]> {
    return this.entityManager
      .find(BlockMetricEntity, {
        where: {
          blockHash: In(blockHashes),
        },
        cache: true,
      })
  }

  async findBlockMetricsTransaction(offset: number, limit: number): Promise<[BlockMetricsTransactionEntity[], number]> {

    return this.entityManager
      .transaction('READ COMMITTED', async (txn): Promise<[BlockMetricsTransactionEntity[], number]> => {

        // much cheaper to do the count against canonical block header table instead of using the
        // usual count mechanism

        const [{ count }] = await txn.find(RowCount, {
          select: ['count'],
          where: {
            relation: 'canonical_block_header',
          },
          cache: true,
        })

        const entities = await txn.find(BlockMetricsTransactionEntity, {
          order: { number: 'DESC' },
          skip: offset,
          take: limit,
          cache: true,
        })

        return [entities, count]
      })

  }

  async findBlockMetricsTransactionByBlockHash(blockHash: string): Promise<BlockMetricsTransactionEntity | undefined> {
    return this.entityManager.findOne(BlockMetricsTransactionEntity, {
      where: { blockHash }, cache: true,
    })
  }

  async findBlockMetricsTransactionFee(offset: number, limit: number): Promise<[BlockMetricsTransactionFeeEntity[], number]> {

    return this.entityManager
      .transaction('READ COMMITTED', async (txn): Promise<[BlockMetricsTransactionFeeEntity[], number]> => {

        // much cheaper to do the count against canonical block header table instead of using the
        // usual count mechanism

        const [{ count }] = await txn.find(RowCount, {
          select: ['count'],
          where: {
            relation: 'canonical_block_header',
          },
          cache: true,
        })

        const entities = await txn.find(BlockMetricsTransactionFeeEntity, {
          order: { number: 'DESC' },
          skip: offset,
          take: limit,
          cache: true,
        })

        return [entities, count]
      })

  }

  async findBlockMetricsTransactionFeeByBlockHash(blockHash: string): Promise<BlockMetricsTransactionFeeEntity | undefined> {
    return this.entityManager.findOne(BlockMetricsTransactionFeeEntity, {
      where: { blockHash }, cache: true,
    })
  }

  private estimateDatapoints(start: Date, end: Date, bucket: TimeBucket): number {

    const startMoment = moment(start)
    const endMoment = moment(end)

    let timeUnit: unitOfTime.Diff
    switch (bucket) {
      case TimeBucket.ONE_HOUR:
        timeUnit = 'hours'
        break
      case TimeBucket.ONE_DAY:
        timeUnit = 'days'
        break
      case TimeBucket.ONE_WEEK:
        timeUnit = 'weeks'
        break
      case TimeBucket.ONE_MONTH:
        timeUnit = 'months'
        break
      case TimeBucket.ONE_YEAR:
        timeUnit = 'years'
        break
      default:
        throw new Error(`Unexpected time bucket: ${bucket}`)
    }

    return startMoment.diff(endMoment, timeUnit)
  }

  async timeseries(
    start: Date,
    end: Date,
    bucket: TimeBucket,
    fields: BlockMetricField[],
  ): Promise<AggregateBlockMetric[]> {

    const datapoints = this.estimateDatapoints(start, end, bucket)

    if (datapoints > 10000) {
      throw new Error('Estimated datapoints exceeds 10,000. Try refining your date range or adjusting your time bucket')
    }

    const select: string[] = []

    switch (bucket) {
      case TimeBucket.ONE_HOUR:
        select.push('time_bucket(\'1 hour\', timestamp) as time')
        break
      case TimeBucket.ONE_DAY:
        select.push('time_bucket(\'1 day\', timestamp) as time')
        break
      case TimeBucket.ONE_WEEK:
        select.push('time_bucket(\'1 week\', timestamp) as time')
        break
      case TimeBucket.ONE_MONTH:
        select.push('time_bucket(\'1 month\', timestamp) as time')
        break
      case TimeBucket.ONE_YEAR:
        select.push('time_bucket(\'1 year\', timestamp) as time')
        break
      default:
        throw new Error(`Unexpected bucket value: ${bucket}`)
    }

    fields.forEach(m => {
      switch (m) {
        case BlockMetricField.AVG_BLOCK_TIME:
          select.push('round(avg(block_time)) as avg_block_time')
          break
        case BlockMetricField.AVG_NUM_UNCLES:
          select.push('round(avg(num_uncles)) as avg_num_uncles')
          break
        case BlockMetricField.AVG_DIFFICULTY:
          select.push('round(avg(difficulty)) as avg_difficulty')
          break
        case BlockMetricField.AVG_TOTAL_DIFFICULTY:
          select.push('round(avg(total_difficulty)) as avg_total_difficulty')
          break
        case BlockMetricField.AVG_GAS_LIMIT:
          select.push('round(avg(avg_gas_limit)) as avg_gas_limit')
          break
        case BlockMetricField.AVG_GAS_PRICE:
          select.push('round(avg(avg_gas_price)) as avg_gas_price')
          break
        case BlockMetricField.AVG_NUM_TXS:
          select.push('round(avg(total_txs)) as avg_num_txs')
          break
        case BlockMetricField.AVG_NUM_SUCCESSFUL_TXS:
          select.push('round(avg(num_successful_txs)) as avg_num_successful_txs')
          break
        case BlockMetricField.AVG_NUM_FAILED_TXS:
          select.push('round(avg(num_failed_txs)) as avg_num_failed_txs')
          break
        case BlockMetricField.AVG_NUM_INTERNAL_TXS:
          select.push('round(avg(num_internal_txs)) as avg_num_internal_txs')
          break
        case BlockMetricField.AVG_TX_FEES:
          select.push('round(avg(avg_tx_fees)) as avg_tx_fees')
          break
        case BlockMetricField.AVG_TOTAL_TX_FEES:
          select.push('round(avg(total_tx_fees)) as avg_total_tx_fees')
          break
        default:
          throw new Error(`Unexpected metric: ${m}`)
      }
    })

    const items = await this.entityManager
      .createQueryBuilder(BlockMetricEntity, 'bm')
      .select(select)
      .where('timestamp between :end and :start')
      .groupBy('time')
      .orderBy({ time: 'DESC' })
      .setParameters({ start, end })
      .cache(true)
      .getRawMany()

    return items.map(item => {

      return {
        timestamp: item.time,
        avgBlockTime: item.avg_block_time,
        avgNumUncles: item.avg_num_uncles,
        avgDifficulty: item.avg_difficulty,
        avgTotalDifficulty: item.avg_total_difficulty,
        avgGasLimit: item.avg_gas_limit,
        avgGasPrice: item.avg_gas_price,
        avgNumTxs: item.avg_num_txs,
        avgNumSuccessfulTxs: item.avg_num_successful_txs,
        avgNumFailedTxs: item.avg_num_failed_txs,
        avgNumInternalTxs: item.avg_num_internal_txs,
        avgTxFees: item.avg_tx_fees,
        avgTotalTxFees: item.avg_total_tx_fees,
      } as AggregateBlockMetric

    })
  }

}
