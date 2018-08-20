import { ChartsRepository } from '@app/server/modules/charts'

export interface ChartService {
  getBlockSize(startDate: Date, endDate: Date): Promise<number>
  getAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getGasLimit(startDate: Date, endDate: Date): Promise<number>
}

export class ChartsServiceImpl implements ChartService {
  constructor(private readonly chartsRepository: ChartsRepository) {}

  public getBlockSize(from: Date, to: Date): Promise<number> {
    return this.chartsRepository.getBlockSize(from, to)
  }

  public getAccountsGrowth(from: Date, to: Date): Promise<any> {
    return this.chartsRepository.getAccountsGrowth(from, to)
  }

  public getAvTxFee(from: Date, to: Date): Promise<any> {
    return this.chartsRepository.getAvTxFee(from, to)
  }

  public getGasLimit(from: Date, to: Date): Promise<number> {
    return this.chartsRepository.getGasLimit(from, to)
  }
}
