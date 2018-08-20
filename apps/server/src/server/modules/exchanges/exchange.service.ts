import { ExchangeRate } from '@app/server/modules/exchanges'

export interface ExchangeService {
  getExchangeRate(): Promise<ExchangeRate>
}

export class MockExchangeServiceImpl implements ExchangeService {
  public getExchangeRate(): Promise<ExchangeRate> {
    throw new Error('Method not implemented.')
  }
}
