import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { AggregateBlockMetricEntity } from '@app/orm/entities/aggregate-block-metric.entity'

enum EventType {
  TOTAL_TXS = 'TotalTxs',
  TOTAL_SUCCESSFUL_TXS = 'TotalSuccessfulTxs',
  TOTAL_FAILED_TXS = 'TotalFailedTxs',
  AVG_DIFFICULTY = 'AvgDifficulty',
  TOTAL_GAS_PRICE = 'AvgTotalGasPricePerBlock',
  AVG_GAS_PRICE = 'AvgGasPricePerBlock',
  AVG_GAS_LIMIT = 'AvgGasLimitPerBlock',
  TOTAL_TX_FEES = 'AvgTotalTxsFeesPerBlock',
  AVG_TX_FEE = 'AvgTxFeePerBlock',
  AVG_MINER_REWARD = 'AvgMinerRewardPerBlock',
  AVG_BLOCK_TIME = 'AvgBlockTime',
  AVG_HASH_RATE = 'AvgHashRate',
}

@Injectable()
export class StatisticService {
  constructor(@InjectRepository(AggregateBlockMetricEntity) private readonly statisticRepository: MongoRepository<AggregateBlockMetricEntity>) {}

  public getTotalTxs(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.TOTAL_TXS, start, end)
  }

  public getTotalSuccessfulTxs(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.TOTAL_SUCCESSFUL_TXS, start, end)
  }

  public getTotalFailedTxs(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.TOTAL_FAILED_TXS, start, end)
  }

  public getAverageDifficulty(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_DIFFICULTY, start, end)
  }

  public getTotalGasPrice(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.TOTAL_GAS_PRICE, start, end)
  }

  public getAverageGasPrice(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_GAS_PRICE, start, end)
  }

  public getAverageGasLimit(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_GAS_LIMIT, start, end)
  }

  public getTotalTxsFees(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.TOTAL_TX_FEES, start, end)
  }

  public getAverageTxFee(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_TX_FEE, start, end)
  }

  public getAverageMinerReward(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_MINER_REWARD, start, end)
  }

  public getAverageBlockTime(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_BLOCK_TIME, start, end)
  }

  public getAverageHashRate(start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    return this.retrieveFromMongo(EventType.AVG_HASH_RATE, start, end)
  }

  private retrieveFromMongo(event: EventType, start: Date, end: Date): Promise<AggregateBlockMetricEntity[]> {
    const where = { $and: [{ name: event }, { date: { $gte: start.getTime() } }, { date: { $lte: end.getTime() } }] }
    return this.statisticRepository.find({ where, order: { date: -1 } })
  }
}
