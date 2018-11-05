import { Statistic, StatisticsRepository } from '@app/server/modules/statistics'
import { CacheRepository } from '@app/server/repositories'

export interface StatisticsService {
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getAveragegasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
  getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository, private readonly cacheRepository: CacheRepository) {}

  public getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]> {
    return this.statisticsRepository.getAverageTotalDifficulty(start, end)
  }
  public getAveragegasPrice(start: Date, end: Date): Promise<Statistic[]> {
    return this.statisticsRepository.getAveragegasPrice(start, end)
  }
  public getAverageTxFee(start: Date, end: Date): Promise<Statistic[]> {
    return this.statisticsRepository.getAverageTxFee(start, end)
  }
  public getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]> {
    return this.statisticsRepository.getAverageSuccessfullTx(start, end)
  }
}
