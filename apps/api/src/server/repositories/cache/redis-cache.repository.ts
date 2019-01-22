import { CacheRepository } from '@app/server/repositories'
import { ExchangeRate, Quote } from 'ethvm-common'
import * as Redis from 'ioredis'

export class RedisCacheRepository implements CacheRepository {

  constructor(private readonly redis: Redis.Redis) {}

  public initialize(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public putRate(exchangerate: ExchangeRate): Promise<boolean> {
    return new Promise(resolve => {
      this.redis
        .set(exchangerate.symbol, JSON.stringify(exchangerate), 'EX', 300)
        .then(result => {
          if (!result) {
            resolve(false)
            return
          }
          resolve(true)
        })
        .catch(error => resolve(false))
    })
  }

  public getQuote(token: string, to: string): Promise<Quote> {
    return new Promise((resolve, reject) => {
      this.redis
        .get(token)
        .then(result => {
          if (!result) {
            reject(false)
            return
          }
          const val = JSON.parse(result) as ExchangeRate
          val.quotes.forEach(q => {
            if (q.to === to) {
              resolve(q)
              return
            }
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
