import { Quote } from 'ethvm-common'
import fetch from 'node-fetch'

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true'

export interface ExchangeRepository {
  getQuote(token: string, to: string): Promise<Quote>
}

export class CoinGeckoRepository implements ExchangeRepository {
  constructor() {}

  public getQuote(token: string, to: string): Promise<Quote> {
    return fetch(API_URL)
      .then(res => res.json())
      .then(res => {
        return {
          to,
          price: res['ethereum']['usd'],
          vol_24h: res['usd_24h_vol'],
          last_update: res['last_updated_at']
        } as Quote
      })
  }
}
