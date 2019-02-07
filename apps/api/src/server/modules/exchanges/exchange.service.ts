import { ExchangeRepository } from '@app/server/modules/exchanges'
import { Quote, TokenExchangeRate } from 'ethvm-common'

export interface ExchangeService {
  getExchangeRate(token: string, to: string): Promise<Quote>
  getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]>
  getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null>
}

export class ExchangeServiceImpl implements ExchangeService {
  constructor(private readonly exchangeRepository: ExchangeRepository) {}

  public getExchangeRate(token: string, to: string): Promise<Quote> {
    return this.exchangeRepository.getQuote(token, to)
  }

  public getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]> {
    return this.exchangeRepository.getTokenExchangeRates(limit, page)
  }

  public getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null> {
    return this.exchangeRepository.getTokenExchangeRate(symbol)
  }
}
