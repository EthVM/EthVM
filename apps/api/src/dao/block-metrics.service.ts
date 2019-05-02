import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Between, In, Repository} from 'typeorm'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import BigNumber from 'bignumber.js'
import {AggregateBlockMetric, TimeBucket} from '@app/graphql/schema'


@Injectable()
export class BlockMetricsService {

  constructor(@InjectRepository(BlockMetricEntity)
              private readonly blockMetricsRepository: Repository<BlockMetricEntity>) {
  }

  async findByBlockHash(blockHashes: string[]): Promise<BlockMetricEntity[]> {
    return this.blockMetricsRepository
      .find({
        where: {
          blockHash: In(blockHashes),
        },
      })
  }

  async find(offset: number, limit: number): Promise<[BlockMetricEntity[], number]> {
    return this.blockMetricsRepository
      .findAndCount({
        order: {number: 'DESC'},
        skip: offset,
        take: limit,
      })
  }

  async aggregate(start: Date, end: Date, bucket: TimeBucket, offset: number, limit: number): Promise<[AggregateBlockMetric[], number]> {

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

    select.push('round(avg(block_time)) as avg_block_time')
    select.push('round(avg(num_uncles)) as avg_num_uncles')
    select.push('round(avg(difficulty)) as avg_difficulty')
    select.push('round(avg(total_difficulty)) as avg_total_difficulty')
    select.push('round(avg(avg_gas_limit)) as avg_gas_limit')
    select.push('round(avg(avg_gas_price)) as avg_gas_price')
    select.push('round(avg(total_txs)) as avg_num_txs')
    select.push('round(avg(num_successful_txs)) as avg_num_successful_txs')
    select.push('round(avg(num_failed_txs)) as avg_num_failed_txs')
    select.push('round(avg(num_internal_txs)) as avg_num_internal_txs')
    select.push('round(avg(avg_tx_fees)) as avg_tx_fees')
    select.push('round(avg(total_tx_fees)) as avg_total_tx_fees')

    const baseQuery = this.blockMetricsRepository
      .createQueryBuilder('bm')
      .select(select)
      .where('timestamp between :start and :end')
      .groupBy('time')
      .orderBy({time: 'DESC'})
      .setParameters({ start, end })

    const count = await baseQuery.getCount()

    const items = await baseQuery
      .offset(offset)
      .limit(limit)
      .getRawMany()

    const metrics = items.map(item => {

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

    return [metrics, count]
  }

}
