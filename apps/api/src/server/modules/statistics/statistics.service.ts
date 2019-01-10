import { toDatePeriods } from '@app/server/core/utils'
import { StatisticsRepository } from '@app/server/modules/statistics'
import { CacheRepository } from '@app/server/repositories'
import { Statistic } from 'ethvm-common'

export interface StatisticsService {
  getAverageTotalDifficulty(duration: string): Promise<Statistic[]>
  getAverageGasPrice(duration: string): Promise<Statistic[]>
  getAverageTxFee(duration: string): Promise<Statistic[]>
  getAverageSuccessfullTx(duration: string): Promise<Statistic[]>
  getAvgFailedTxStats(duration: string): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository, private readonly cacheRepository: CacheRepository) {}

  public getAverageTotalDifficulty(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTotalDifficulty(from, to)
  }

  public getAverageGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasPrice(from, to)
  }

  public getAverageTxFee(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTxFee(from, to)
  }

  public getAverageSuccessfullTx(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageSuccessfullTx(from, to)
  }

  public getAvgFailedTxStats(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageFailedTx(from, to)
  }
}
