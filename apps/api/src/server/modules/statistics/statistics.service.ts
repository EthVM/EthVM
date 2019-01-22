import { toDatePeriods } from '@app/server/core/utils'
import { StatisticsRepository } from '@app/server/modules/statistics'
import { Statistic } from 'ethvm-common'

export interface StatisticsService {
  getAverageTotalTxs(duration: string): Promise<Statistic[]>
  getAverageSuccessfullTxs(duration: string): Promise<Statistic[]>
  getAverageTotalDifficulty(duration: string): Promise<Statistic[]>
  getAverageFailedTxs(duration: string): Promise<Statistic[]>
  getTotalGasPrice(duration: string): Promise<Statistic[]>
  getAverageGasPrice(duration: string): Promise<Statistic[]>
  getTotalTxsFees(duration: string): Promise<Statistic[]>
  getAverageTxFee(duration: string): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {

  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  getAverageTotalTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTotalTxs(from, to)
  }

  getAverageSuccessfullTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageSuccessfullTxs(from, to)
  }

  getAverageTotalDifficulty(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTotalDifficulty(from, to)
  }

  getAverageFailedTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageFailedTxs(from, to)
  }

  getTotalGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalGasPrice(from, to)
  }

  getAverageGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasPrice(from, to)
  }

  getTotalTxsFees(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalTxsFees(from, to)
  }

  getAverageTxFee(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTxFee(from, to)
  }

}
