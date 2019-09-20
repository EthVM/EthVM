import {Injectable} from '@nestjs/common'
import {InjectEntityManager} from '@nestjs/typeorm'
import {Between, EntityManager, Equal, FindOneOptions, In, LessThanOrEqual} from 'typeorm'
import {AggregateBlockMetric, BlockMetricField, TimeBucket} from '@app/graphql/schema'
import {unitOfTime} from 'moment'
import BigNumber from 'bignumber.js'
import {BlockMetricsTraceEntity} from '@app/orm/entities/block-metrics-trace.entity'
import moment = require('moment')
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {BlockMetricsHeaderEntity} from '@app/orm/entities/block-metrics-header.entity'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'

/**
 * @const
 * @type {BlockMetricField[]}
 * @default
 */
const HEADER_FIELDS = [
  BlockMetricField.AVG_BLOCK_TIME,
  BlockMetricField.AVG_DIFFICULTY,
  BlockMetricField.AVG_TOTAL_DIFFICULTY,
  BlockMetricField.AVG_NUM_UNCLES,
  BlockMetricField.AVG_GAS_LIMIT,
  BlockMetricField.AVG_GAS_PRICE,
]

/**
 * @const
 * @type {BlockMetricField[]}
 * @default
 */
const TX_TRACE_FIELDS = [
  BlockMetricField.AVG_NUM_TXS,
  BlockMetricField.AVG_NUM_SUCCESSFUL_TXS,
  BlockMetricField.AVG_NUM_FAILED_TXS,
  BlockMetricField.AVG_NUM_INTERNAL_TXS,
  BlockMetricField.AVG_TX_FEES,
  BlockMetricField.AVG_TOTAL_TX_FEES,
]

@Injectable()
export class BlockMetricsService {

  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {
  }

  /**
   * Find block metrics trace entities by block hashes.
   * @param {string[]} blockHashes - Array of block hashes.
   * @param {Date} maxTimestamp - Max timestamp for filtering (to improve performance).
   * @param {Date} minTimestamp - Min timestamp for filtering (to improve performance).
   * @param {EntityManager} txn - The txn within which to perform the query.
   * @returns {Promise<BlockMetricsTraceEntity[]>}
   */
  async findBlockMetricsTraces(blockHashes: string [], maxTimestamp: Date, minTimestamp: Date, txn?: EntityManager): Promise<BlockMetricsTraceEntity[]> {
    txn = txn || this.entityManager
    return txn
      .find(BlockMetricsTraceEntity, {
        where: {
          hash: In(blockHashes),
          timestamp: Between(minTimestamp, maxTimestamp),
        },
        cache: true,
      })
  }

  /**
   * Find a block metrics trace entity for a given block hash.
   * @param {string} hash - The block hash to filter by.
   * @param {Date} maxTimestamp - Max timestamp for filtering (to improve performance).
   * @param {Date} minTimestamp - Min timestamp for filtering (to improve performance).
   * @param {boolean} cache - Whether to use the cache.
   * @param {BigNumber} blockNumber - Block metrics trace entities for block numbers above this will be ignored.
   * @returns {Promise<BlockMetricsTraceEntity | undefined>}
   */
  async findBlockMetricsTraceByHash(
    hash: string,
    maxTimestamp: Date,
    minTimestamp: Date,
    cache: boolean = true,
    blockNumber: BigNumber,
  ): Promise<BlockMetricsTraceEntity | undefined> {
    return this.entityManager
      .findOne(BlockMetricsTraceEntity, {
        where: { hash, number: LessThanOrEqual(blockNumber), timestamp: Between(minTimestamp, maxTimestamp) },
        cache,
      })
  }

  /**
   * Find block metric entity by block hash.
   * @param {string} hash - The block hash to filter by.
   * @param {BigNumber} blockNumber - Block metrics trace entities for block numbers above this will be ignored.
   * @param {Date} timestamp - Timestamp to filter by (to improve performance).
   * @returns {Promise<BlockMetricEntity | undefined>}
   */
  async findBlockMetric(hash: string, blockNumber: BigNumber, timestamp: Date): Promise<BlockMetricEntity | undefined> {
    return this.entityManager
      .findOne(BlockMetricEntity, {
        where: {
          hash,
          timestamp: Equal(timestamp),
          number: LessThanOrEqual(blockNumber),
        },
      })
  }

  /**
   * Find a page of blocks metric entities
   * @param {number} [offset=0] - Number of items to skip.
   * @param {number} [limit=10] - Page size.
   * @param {BigNumber} blockNumber - Block metrics trace entities for block numbers above this will be ignored.
   * @returns {Promise<BlockMetricEntity[], number>} An array of block metric entities and the total count.
   */
  async findBlockMetrics(offset: number = 0, limit: number = 10, blockNumber: BigNumber): Promise<[BlockMetricEntity[], number]> {

    return this.entityManager
      .transaction('READ COMMITTED', async (txn): Promise<[BlockMetricEntity[], number]> => {

        // It's much cheaper to do the count against canonical block header table instead of using the usual count mechanism.
        // Also retrieve the timestamp of the latest block to improve performance of the BlockMetricEntity query.

        const {number, timestamp} = await txn
          .findOne(BlockHeaderEntity, {
            select: ['number', 'timestamp'],
            where: {
              number: LessThanOrEqual(blockNumber),
            },
            order: {
              number: 'DESC',
            },
            cache: true,
          } as FindOneOptions)

        const entities = await txn.find(BlockMetricEntity, {
          where: {
            number: LessThanOrEqual(blockNumber),
            timestamp: LessThanOrEqual(timestamp),
          },
          order: { number: 'DESC' },
          skip: offset,
          take: limit,
          cache: true,
        })

        return [entities, number + 1]
      })

  }

  /**
   * Estimate the total number of datapoints that will be returned by the "timeseries" query.
   * @private
   * @param {Date} [start=new Date()] - The start date of the query.
   * @param {Date} [end=new Date('2000-01-01T00:00:00.000Z')] - The end date of the query.
   * @param {TimeBucket} bucket - Length of time to aggregate metrics by.
   * @returns {number}
   */
  private estimateDatapoints(start: Date = new Date(), end: Date = new Date('2000-01-01T00:00:00.000Z'), bucket: TimeBucket): number {

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

  /**
   * Get a series of time-identified data (a list of block metric data aggregated by a given time bucket).
   * @param {TimeBucket} bucket - The length of time to aggregate block metrics by.
   * @param {BlockMetricField} field - The field of a block metric entity to aggregate data for.
   * @param {BigNumber} blockNumber - Block metric entities for block numbers above this will be ignored.
   * @param {Date} [start] - The start date to filter by.
   * @param {Date} [end=new Date('2000-01-01T00:00:00.000Z')] - The end date to filter by.
   * @returns {Promise<AggregateBlockMetric[]>} An array of aggregated block metrics in descending order with data for the requested field only.
   */
  async timeseries(
    bucket: TimeBucket,
    field: BlockMetricField,
    blockNumber: BigNumber,
    start?: Date,
    end: Date = new Date('2000-01-01T00:00:00.000Z'),
  ): Promise<AggregateBlockMetric[]> {

    // If start or end is set, round to nearest minute in order to take advantage of caching similar queries.
    // Start is set to end of minute as it is later in time, and vice versa, to be inclusive of time range.
    start = start ? moment(start).endOf('minute').toDate() : undefined
    end = moment(end).startOf('minute').toDate()

    // Estimate the number of datapoints and throw an error if it is too many.

    const datapoints = this.estimateDatapoints(start, end, bucket)

    if (datapoints > 10000) {
      throw new Error('Estimated datapoints exceeds 10,000. Try refining your date range or adjusting your time bucket')
    }

    // Start building the query.

    const select: string[] = []
    let queryBuilder

    // Select the start timestamp of the time bucket
    switch (bucket) {
      case TimeBucket.ONE_HOUR:
        select.push('time_bucket(\'1 hour\', bm.timestamp) as time')
        break
      case TimeBucket.ONE_DAY:
        select.push('time_bucket(\'1 day\', bm.timestamp) as time')
        break
      case TimeBucket.ONE_WEEK:
        select.push('time_bucket(\'1 week\', bm.timestamp) as time')
        break
      case TimeBucket.ONE_MONTH:
        select.push('time_bucket(\'1 month\', bm.timestamp) as time')
        break
      case TimeBucket.ONE_YEAR:
        select.push('time_bucket(\'1 year\', bm.timestamp) as time')
        break
      default:
        throw new Error(`Unexpected bucket value: ${bucket}`)
    }

    // Select the rounded avg of only the required field.
    switch (field) {
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
        throw new Error(`Unexpected metric: ${field}`)
    }

    // Create query builder for correct entity depending on the field requested.

    if (HEADER_FIELDS.indexOf(field) > -1) {
      queryBuilder = this.entityManager.createQueryBuilder(BlockMetricsHeaderEntity, 'bm')
    } else if (TX_TRACE_FIELDS.indexOf(field) > -1) {
      queryBuilder = this.entityManager.createQueryBuilder(BlockMetricsTraceEntity, 'bm')
    } else {
      throw new Error(`Unexpected metric: ${field}`)
    }

    // Set where clause if start and/or end params are set.

    queryBuilder
      .select(select)
      .where('bm.number <= :blockNumber')

    if (start) {
      queryBuilder.andWhere('bm.timestamp between :end and :start', {start, end})
    } else {
      queryBuilder.andWhere('bm.timestamp > :end', {end}) // End has been defaulted to {new Date('2000-01-01T00:00:00.000Z')}
    }

    // Perform query.
    const items = await queryBuilder
      .groupBy('time')
      .orderBy({time: 'DESC'})
      .setParameters({start, end, blockNumber: blockNumber.toNumber()})
      .cache(true)
      .getRawMany()

    // Map items to AggregateBlockMetric shape before returning.

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
