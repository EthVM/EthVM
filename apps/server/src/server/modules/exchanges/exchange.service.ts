import { logger } from '@app/logger'
import { ExchangeRate, ExchangeRepository, Quote } from '@app/server/modules/exchanges'
import { CacheRepository } from '@app/server/repositories'

export interface ExchangeService {
  getExchangeRate(token: string, to: string): Promise<Quote>
  fetchExchangeRates(): Promise<boolean>
}

export class ExchangeServiceImpl implements ExchangeService {
  constructor(readonly exchangeRepository: ExchangeRepository, readonly cacheRepository: CacheRepository) {}

  public getExchangeRate(token: string, to: string): Promise<Quote> {
    return this.cacheRepository.getQuote(token, to)
  }

  public fetchExchangeRates(): Promise<boolean> {
    return this.exchangeRepository.fetchAll()
  }
}
