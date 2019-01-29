import { logger } from '@app/logger'
import { ExchangeRepository } from '@app/server/modules/exchanges'
import { Quote } from 'ethvm-common'

export interface ExchangeService {
  getExchangeRate(token: string, to: string): Promise<Quote>
}

export class ExchangeServiceImpl implements ExchangeService {
  constructor(readonly exchangeRepository: ExchangeRepository) {}

  public getExchangeRate(token: string, to: string): Promise<Quote> {
    logger.info('ExchangeService - GetExchangeRate / Token: ', token, ' To: ', to)
    return this.exchangeRepository.getQuote(token, to)
  }
}
