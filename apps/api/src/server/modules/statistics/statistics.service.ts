import { toDatePeriods } from '@app/server/core/utils'
import { StatisticsRepository } from '@app/server/modules/statistics'
import { Statistic } from 'ethvm-common'

export interface StatisticsService {
  getTotalTxs(duration: string): Promise<Statistic[]>
  getTotalSuccessfulTxs(duration: string): Promise<Statistic[]>
  getTotalFailedTxs(duration: string): Promise<Statistic[]>
  getAverageDifficulty(duration: string): Promise<Statistic[]>
  getTotalGasPrice(duration: string): Promise<Statistic[]>
  getAverageGasPrice(duration: string): Promise<Statistic[]>
  getAverageGasLimit(duration: string): Promise<Statistic[]>
  getTotalTxsFees(duration: string): Promise<Statistic[]>
  getAverageTxFee(duration: string): Promise<Statistic[]>
  getAverageMinerReward(duration: string): Promise<Statistic[]>
  getAverageBlockTime(duration: string): Promise<Statistic[]>
  getAverageHashRate(duration: string): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {

  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  public getTotalTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalTxs(from, to)
  }

  public getTotalSuccessfulTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalSuccessfulTxs(from, to)
  }

  public getTotalFailedTxs(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalFailedTxs(from, to)
  }

  public getAverageDifficulty(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageDifficulty(from, to)
  }

  public getTotalGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalGasPrice(from, to)
  }

  public getAverageGasPrice(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasPrice(from, to)
  }

  public getAverageGasLimit(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageGasLimit(from, to)
  }

  public getTotalTxsFees(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getTotalTxsFees(from, to)
  }

  public getAverageTxFee(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageTxFee(from, to)
  }

  public getAverageMinerReward(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageMinerReward(from, to)
  }

  public getAverageBlockTime(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageBlockTime(from, to)
  }

  public getAverageHashRate(duration: string): Promise<Statistic[]> {
    const { from, to } = toDatePeriods(duration)
    return this.statisticsRepository.getAverageHashRate(from, to)
  }

}
