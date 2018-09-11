import { logger } from '@app/logger'
import { b64Replacer, b64Reviver } from '@app/server/core/encoding'
import { Block } from '@app/server/modules/blocks'
import { ExchangeRate, Quote } from '@app/server/modules/exchanges'
import { Tx } from '@app/server/modules/txs'
import { CacheRepository } from '@app/server/repositories'
import { bufferToHex } from 'ethereumjs-util'
import * as Redis from 'ioredis'

export interface RedisCacheRepositoryOpts {
  host: string
  port: number
  socketRows: number
}

// TODO: Separate memory cache to its own class
export class RedisCacheRepository implements CacheRepository {
  private readonly cache: Map<string, Block[] | Tx[]> = new Map()

  constructor(private readonly redis: Redis.Redis, private readonly socketRows: number) {}

  public initialize(): Promise<boolean> {
    return new Promise(resolve => {
      Promise.all([this.getBlocks(), this.getTransactions()])
        .then(results => {
          this.cache.set('blocks', results[0])
          this.cache.set('transactions', results[1])
          resolve(true)
        })
        .catch(error => {
          logger.error(`RedisDataStore - initialize() / Error: ${error}`)
          this.cache.set('blocks', [])
          this.cache.set('transactions', [])
          resolve(true)
        })
    })
  }

  public putBlock(block: Block): Promise<boolean> {
    logger.debug(`RedisDataStore - putBlock / Block: ${block.hash}`)

    return this.getArray<Block>('blocks')
      .then((blocks: Block[]) => {
        blocks.unshift(block)

        if (blocks.length > this.socketRows) {
          blocks = blocks.slice(0, this.socketRows)
        }

        this.cache.set('blocks', blocks)
        this.redis.set('blocks', JSON.stringify(blocks, b64Replacer))

        return Promise.resolve(true)
      })
      .catch(error => {
        logger.error(`RedisDataStore - putBlock() / Error: ${error}`)
        return Promise.resolve(false)
      })
  }

  public getBlocks(): Promise<Block[]> {
    return this.getArray<Block>('blocks')
  }

  public putTransactions(txs: Tx[]): Promise<boolean> {
    logger.debug(`RedisDataStore - putTransaction / Txs: ${txs.length}`)

    return this.getArray<Tx>('transactions')
      .then((_txs: Tx[]) => {
        if (Array.isArray(txs)) {
          txs.forEach(t => {
            _txs.unshift(t)
          })
        } else {
          _txs.unshift(txs)
        }

        if (_txs.length > this.socketRows) {
          _txs = _txs.slice(0, this.socketRows)
        }

        this.cache.set('transactions', _txs)
        this.redis.set('transactions', JSON.stringify(_txs, b64Replacer))

        return Promise.resolve(true)
      })
      .catch(error => {
        logger.error(`RedisDataStore - putTransaction() / Error: ${error}`)
        return Promise.resolve(false)
      })
  }

  public getTransactions(): Promise<Tx[]> {
    return this.getArray<Tx>('transactions')
  }

  public putRate(exchangerate: ExchangeRate): Promise<boolean> {
    return new Promise(resolve => {
      this.redis
        .set(exchangerate.symbol, JSON.stringify(exchangerate), 'EX', 300)
        .then(result => {
          if (!result) {
            resolve(false)
          }
          resolve(true)
        })
        .catch(error => {
          resolve(false)
        })
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

  private getArray<T extends Tx | Block>(key: string): Promise<T[]> {
    return new Promise(resolve => {
      const values = this.cache.get(key) as T[]
      if (values && values.length) {
        resolve(values)
        return
      }

      this.redis
        .get(key)
        .then(result => {
          if (!result) {
            logger.debug(`RedisDataStore - getArray() / Key: ${key} | Result: empty`)
            resolve([])
            return
          }

          logger.debug(`RedisDataStore - getArray() / Key: ${key} | Result: ${result.length}`)

          const buffered = JSON.parse(result, b64Reviver)
          this.cache.set(key, buffered)

          resolve(buffered)
        })
        .catch(error => {
          logger.error(`RedisDataStore - getArray() / Error while retrieving array with key: ${key}. Error: ${error}`)
          resolve([])
        })
    })
  }
}
