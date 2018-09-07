import { ExchangeRate } from '@app/server/modules/exchanges'

export interface ExchangeService {
  getExchangeRate(token: string): Promise<ExchangeRate>
  getExchangeRates(tokens: string[]): Promise<ExchangeRate[]>
}

export class MockExchangeServiceImpl implements ExchangeService {
  public getExchangeRate(token: string): Promise<ExchangeRate> {
    throw new Error('Method not implemented.')
  }

  public getExchangeRates(tokens: string[]): Promise<ExchangeRate[]> {
    throw new Error('Method not implemented.')
  }
}
