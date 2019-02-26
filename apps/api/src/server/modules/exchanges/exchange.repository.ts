import { toTokenExchangeRate } from '@app/server/modules/tokens'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Quote, TokenExchangeRate } from 'ethvm-common'
import fetch from 'node-fetch'

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true'

export interface ExchangeRepository {
  getQuote(token: string, to: string): Promise<Quote>
  getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]>
  getTotalNumberOfTokenExchangeRates(): Promise<number>
  getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null>
  getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate | null>
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

  public getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]> {
    const start = page * limit
    let sort
    switch (filter) {
      case 'price_high':
        sort = { price_change_24h: -1 }
        break
      case 'price_low':
        sort = { price_change_24h: 1 }
        break
      case 'volume_high':
        sort = { total_volume: -1 }
        break
      case 'volume_low':
        sort = { total_volume: 1 }
        break
      case 'market_cap_high':
        sort = { market_cap_change_24h: -1 }
        break
      case 'market_cap_low':
        sort = { market_cap_change_24h: 1 }
        break
      case 'market_cap_rank':
      default:
        sort = { market_cap_rank: 1 }
        break
    }
    return this.db
      .collection(MongoEthVM.collections.tokenExchangeRates)
      .find({})
      .sort(sort)
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => (resp ? resp.map(e => toTokenExchangeRate(e)) : []))
  }

  public getTotalNumberOfTokenExchangeRates(): Promise<number> {
    return this.db.collection(MongoEthVM.collections.tokenExchangeRates).estimatedDocumentCount()
  }

  public getTokenExchangeRate(symbol: string): Promise<TokenExchangeRate | null> {
    return this.db
      .collection(MongoEthVM.collections.tokenExchangeRates)
      .findOne({ _id: symbol })
      .then(res => (res ? toTokenExchangeRate(res) : null))
  }

  public getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate | null> {
    return this.db
      .collection(MongoEthVM.collections.tokenExchangeRates)
      .findOne({ address })
      .then(res => (res ? toTokenExchangeRate(res) : null))
  }
}
