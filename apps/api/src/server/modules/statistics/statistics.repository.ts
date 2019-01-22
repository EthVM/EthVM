import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Statistic } from 'ethvm-common'
import { toStatistic } from '@app/server/modules/statistics'

export interface StatisticsRepository {
  getAverageTotalTxs(start: Date, end: Date): Promise<Statistic[]>
  getAverageSuccessfullTxs(start: Date, end: Date): Promise<Statistic[]>
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getAverageFailedTxs(start: Date, end: Date): Promise<Statistic[]>
  getTotalGasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]>
  getTotalTxsFees(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
}

export class MongoStatisticsRepository extends BaseMongoDbRepository implements StatisticsRepository {
  public getAverageTotalTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalTxs', start, end)
  }

  public getAverageSuccessfullTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('NumSuccessfulTxs', start, end)
  }

  public getAverageFailedTxs(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('NumFailedTxs', start, end)
  }

  public getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalDifficulty', start, end)
  }

  public getTotalGasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalGasPrice', start, end)
  }

  public getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgGasPrice', start, end)
  }

  public getTotalTxsFees(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('TotalTxsFees', start, end)
  }

  public getAverageTxFee(start: Date, end: Date): Promise<Statistic[]> {
    return this.retrieveFromMongo('AvgTxsFees', start, end)
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
