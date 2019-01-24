import { toDatePeriods } from '@app/server/core/utils'
import { StatisticsRepository } from '@app/server/modules/statistics'
import { Statistic } from 'ethvm-common'

export interface StatisticsService {
  getTotalTxs(duration: string): Promise<Statistic[]>
  getTotalSuccessfulTxs(duration: string): Promise<Statistic[]>
  getTotalFailedTxs(duration: string): Promise<Statistic[]>
  getAverageTotalDifficulty(duration: string): Promise<Statistic[]>
  getTotalGasPrice(duration: string): Promise<Statistic[]>
  getAverageGasPrice(duration: string): Promise<Statistic[]>
  getAverageGasLimit(duration: string): Promise<Statistic[]>
  getTotalTxsFees(duration: string): Promise<Statistic[]>
  getAverageTxFee(duration: string): Promise<Statistic[]>
  getAverageMinerReward(duration: string): Promise<Statistic[]>
  getAverageBlockTime(duration: string): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {

  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  getTotalTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalTxs(from, to)
  }

  getTotalSuccessfulTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalSuccessfulTxs(from, to)
  }

  getTotalFailedTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalFailedTxs(from, to)
  }

  getAverageTotalDifficulty(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTotalDifficulty(from, to)
  }

  getTotalGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalGasPrice(from, to)
  }

  getAverageGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasPrice(from, to)
  }

  getAverageGasLimit(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasLimit(from, to)
  }

  getTotalTxsFees(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalTxsFees(from, to)
  }

  getAverageTxFee(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTxFee(from, to)
  }

  getAverageMinerReward(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageMinerReward(from, to)
  }

  getAverageBlockTime(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageBlockTime(from, to)
  }

}
