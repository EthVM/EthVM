import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Statistic } from 'ethvm-common'
import { toStatistic } from '@app/server/modules/statistics'

export interface StatisticsRepository {
  getTotalTxs(start: Date, end: Date): Promise<Statistic[]>
  getTotalSuccessfulTxs(start: Date, end: Date): Promise<Statistic[]>
  getAverageDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getTotalFailedTxs(start: Date, end: Date): Promise<Statistic[]>
  getTotalGasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageGasLimit(start: Date, end: Date): Promise<Statistic[]>
  getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]>
  getTotalTxsFees(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
  getAverageMinerReward(start: Date, end: Date): Promise<Statistic[]>
  getAverageBlockTime(start: Date, end: Date): Promise<Statistic[]>
  getAverageHashRate(start: Date, end: Date): Promise<Statistic[]>
}

export class MongoStatisticsRepository extends BaseMongoDbRepository implements StatisticsRepository {

  public getTotalTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalTxs', start, end)
  }

  public getTotalSuccessfulTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalSuccessfulTxs', start, end)
  }

  public getTotalFailedTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalFailedTxs', start, end)
  }

  public getAverageDifficulty(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgDifficulty', start, end)
  }

  public getTotalGasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgTotalGasPricePerBlock', start, end)
  }

  public getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgGasPricePerBlock', start, end)
  }

  public getAverageGasLimit(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgGasLimitPerBlock', start, end)
  }

  public getTotalTxsFees(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgTotalTxsFeesPerBlock', start, end)
  }

  public getAverageTxFee(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgTxFeePerBlock', start, end)
  }

  public getAverageMinerReward(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgMinerRewardPerBlock', start, end)
  }

  public getAverageBlockTime(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgBlockTime', start, end)
  }

  public getAverageHashRate(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgHashRate', start, end)
  }

  private retrieveFromMongo(event: string, start: Date, end: Date): Promise<Statistic[]> {
    return this.db
      .collection(MongoEthVM.collections.statistics)
      .find({ $and: [{ name: event }, { date: { $gte: start.getTime() } }, { date: { $lte: end.getTime() } }] })
      .sort({ date: -1 })
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }

        return resp.map(r => toStatistic(r))
      })
  }
}
