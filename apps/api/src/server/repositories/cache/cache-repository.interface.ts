import { ExchangeRate, Quote } from 'ethvm-common'
import { Repository } from '@app/server/repositories'

export interface CacheRepository extends Repository {
  initialize(): Promise<boolean>
  putRate(exchangerate: ExchangeRate): Promise<boolean>
  getQuote(token: string, to: string): Promise<Quote>
}
