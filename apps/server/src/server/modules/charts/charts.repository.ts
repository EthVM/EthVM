export interface ChartsRepository {
  getBlockSize(startDate: Date, endDate: Date): Promise<number>
  getAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getGasLimit(startDate: Date, endDate: Date): Promise<number>
}

export class MockChartsRepository implements ChartsRepository {
  public getBlockSize(start: Date, end: Date): Promise<number> {
    return Promise.reject()
  }

  public getAccountsGrowth(start: Date, end: Date): Promise<any> {
    return Promise.reject()
  }

  public getAvTxFee(start: Date, end: Date): Promise<any> {
    return Promise.reject()
  }

  public getGasLimit(start: Date, end: Date): Promise<number> {
    return Promise.reject()
  }
}
