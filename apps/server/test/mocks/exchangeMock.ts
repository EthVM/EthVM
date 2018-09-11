import { ExchangeService, Quote } from '@app/server/modules/exchanges'


export class MockExchange implements ExchangeService{

  public getExchangeRate(token: string, to: string): Promise<Quote>{
    const q:Quote = {}
    return Promise.resolve(q)
  }

  public fetchExchangeRates(): Promise<boolean>{
    return Promise.resolve(false)
  }

}
