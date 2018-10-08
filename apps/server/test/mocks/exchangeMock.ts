import { ExchangeRate, ExchangeRepository, Quote } from '@app/server/modules/exchanges'

export class MockExchangeRepository implements ExchangeRepository {
  constructor(protected readonly cache: any) {}

  public fetchAll(): Promise<boolean> {
    // Fill Redis Cache with ExchangeRate
    const quote: Quote = { to: 'USD', price: '2000' }
    const quote2: Quote = { to: 'EUR', price: '223' }
    const er: ExchangeRate = { symbol: 'BTC', quotes: [quote, quote2], total_supply: 1000 }
    return this.cache.putRate(er)
  }
}
