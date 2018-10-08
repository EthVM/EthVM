import { ChartService, ChartsRepository } from '@app/server/modules/charts'

export class ChartsServiceImpl implements ChartService {
  constructor(private readonly chartsRepository: ChartsRepository) {}

  public getBlockSize(from: Date, to: Date): Promise<number> {
    return Promise.resolve(3)
  }

  public getAccountsGrowth(from: Date, to: Date): Promise<any> {
    return Promise.resolve({})
  }

  public getAvTxFee(from: Date, to: Date): Promise<any> {
    return Promise.resolve({})
  }

  public getGasLimit(from: Date, to: Date): Promise<number> {
    return Promise.resolve(3)
  }
}
