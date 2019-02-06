import { toTokenExchangeRate } from '@app/server/modules/tokens'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Quote, TokenExchangeRate } from 'ethvm-common'
import fetch from 'node-fetch'

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true'

export interface ExchangeRepository {
  getQuote(token: string, to: string): Promise<Quote>
  getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]>
  getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null>
}

export class ExchangeRepositoryImpl extends BaseMongoDbRepository implements ExchangeRepository {
  public getQuote(token: string, to: string): Promise<Quote> {
    return fetch(API_URL)
      .then(res => res.json())
      .then(res => {
        return {
          to,
          price: res.ethereum.usd,
          vol_24h: res.usd_24h_vol,
          last_update: res.last_updated_at
        }
      })
  }

  public getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.tokenExchangeRates)
      .find({})
      .sort({ timestamp: -1, market_cap_rank: 1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const r: TokenExchangeRate[] = []
        if (!resp) {
          return r
        }
        resp.forEach(e => r.push(toTokenExchangeRate(e)))
        return r
      })
  }

  public getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null> {
    return this.db
      .collection(MongoEthVM.collections.tokenExchangeRates)
      .findOne({ symbol })
      .then(res => (res ? toTokenExchangeRate(res) : null))
  }
}
