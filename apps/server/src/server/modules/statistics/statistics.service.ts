import { Statistic, StatisticsRepository } from '@app/server/modules/statistics'

export interface StatisticsService {
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getAveragegasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
  getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]>
}

export class StatisticsServiceImpl implements StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

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
