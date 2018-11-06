import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Statistic } from 'ethvm-common'

export interface StatisticsRepository {
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getAveragegasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
  getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]>
}

export class MongoStatisticsRepository extends BaseMongoDbRepository implements StatisticsRepository {
  public getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]> {
    return this.db
      .collection(MongoEthVM.collections.statistics)
      .find({ $and: [{ name: 'avg_total_difficulty' }, { date: { $gte: start } }, { date: { $lte: end } }] })
      .sort({ _id: -1 })
      .toArray()
      .then(resp => {
        return resp
      })
  }

  public getAveragegasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.db
      .collection(MongoEthVM.collections.statistics)
      .find({ $and: [{ name: 'avg_gas_price' }, { date: { $gte: start } }, { date: { $lte: end } }] })
      .sort({ _id: -1 })
      .toArray()
      .then(resp => {
        return resp
      })
  }

  public getAverageTxFee(start: Date, end: Date): Promise<Statistic[]> {
    return this.db
      .collection(MongoEthVM.collections.statistics)
      .find({ $and: [{ name: 'avg_txs_fees' }, { date: { $gte: start } }, { date: { $lte: end } }] })
      .sort({ _id: -1 })
      .toArray()
      .then(resp => {
        return resp
      })
  }

  public getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]> {
    return this.db
      .collection(MongoEthVM.collections.statistics)
      .find({ $and: [{ name: 'avg_successful_txs' }, { date: { $gte: start } }, { date: { $lte: end } }] })
      .sort({ _id: -1 })
      .toArray()
      .then(resp => {
        return resp
      })
  }
}
