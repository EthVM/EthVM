import { StatisticsRepository } from '@app/server/modules/statistics'
import { CacheRepository } from '@app/server/repositories'
import { Statistic } from 'ethvm-common'
import { toDatePeriods } from '@app/server/core/utils'


export interface StatisticsService {
  getAverageTotalDifficulty(duration : string): Promise<Statistic[]>
  getAveragegasPrice(duration : string): Promise<Statistic[]>
  getAverageTxFee(duration : string): Promise<Statistic[]>
  getAverageSuccessfullTx(duration : string): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository, private readonly cacheRepository: CacheRepository) {}
  public getAverageTotalDifficulty(duration : string): Promise<Statistic[]> {
    let {from,to} = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTotalDifficulty(from, to)
  }
  public getAveragegasPrice(duration : string): Promise<Statistic[]> {
    let {from,to} = toDatePeriods(duration)
    return this.statisticsRepository.getAveragegasPrice(from, to)
  }
  public getAverageTxFee(duration : string): Promise<Statistic[]> {
    let {from,to} = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTxFee(from, to)
  }
  public getAverageSuccessfullTx(duration : string): Promise<Statistic[]> {
    let {from,to} = toDatePeriods(duration)
    return this.statisticsRepository.getAverageSuccessfullTx(from, to)
  }
}
