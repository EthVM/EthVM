import { logger } from '@app/logger'
import { Quote } from '@app/server/modules/exchanges'
import fetch from 'node-fetch'

export interface ExchangeRepository {
  fetchAll(): Promise<boolean>
}

export class CoinMarketCapRepository implements ExchangeRepository {
  constructor(protected readonly cache: any) {}

  public fetchAll(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      logger.debug(`CoinMarketCapRepository - fetchAll  / Cache exchange rates`)
      fetch('https://api.coinmarketcap.com/v2/ticker/')
        .then(res => res.json())
        .then(json => {
          const coins = json.data
          const promises: Array<Promise<boolean>> = []
          for (const coin in coins) {
            if (coin) {
              const exchangerate: any = {}
              exchangerate.symbol = coins[coin].symbol
              exchangerate.total_supply = coins[coin].total_supply
              const quotes: Quote[] = []
              for (const currency in coins[coin].quotes) {
                if (currency) {
                  const q: any = {}
                  q.to = currency
                  q.price = coins[coin].quotes[currency].price
                  q.market_cap = coins[coin].quotes[currency].market_cap
                  q.volume_24h = coins[coin].quotes[currency].volume_24h
                  q.last_update = coins[coin].quotes[currency].last_update
                  quotes.push(q)
                }
              }
              exchangerate.quotes = quotes
              promises.push(this.cache.putRate(exchangerate))
            }
          }
          Promise.all(promises)
            .then(values => {
              logger.debug(`CoinMarketCapRepository - fetchAll() / Done caching ${promises.length} exchange rates`)
              resolve(true)
            })
            .catch(error => {
              reject(error)
            })
        })
    })
  }
}
