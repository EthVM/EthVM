import { ExchangeRepository } from '@app/server/modules/exchanges'
import { CacheRepository } from '@app/server/repositories'
import { Quote } from 'ethvm-models'

export interface ExchangeService {
  getExchangeRate(token: string, to: string): Promise<Quote>
}

export class ExchangeServiceImpl implements ExchangeService {
  constructor(readonly exchangeRepository: ExchangeRepository, readonly cacheRepository: CacheRepository) {}

  public getExchangeRate(token: string, to: string): Promise<Quote> {
    return new Promise(resolve => {
      this.cacheRepository
        .getQuote(token, to)
        .then(q => resolve(q))
        .catch(err => {
          this.exchangeRepository.fetchAll().then(bool => {
            this.cacheRepository.getQuote(token, to).then(q => resolve(q))
          })
        })
    })
  }
}
