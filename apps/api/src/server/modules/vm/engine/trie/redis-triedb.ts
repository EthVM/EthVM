import config from '@app/config'
import { Callback } from '@app/interfaces'
import { TrieDB, TrieDBOptions } from '@app/server/modules/vm/engine/trie'
import * as Redis from 'ioredis'
import * as jayson from 'jayson/promise'

export interface RedisTrieDbOpts {
  host: string
  port: number
  db: number
  rpcHost: string
  rpcPort: number
}

export class RedisTrieDb implements TrieDB {
  private readonly redis: Redis.Redis
  private readonly rpc: any

  constructor(private opts: RedisTrieDbOpts) {
    this.redis = new Redis({
      host: this.opts.host,
      port: this.opts.port,
      db: this.opts.db
    })

    const rpcUrl = config.get('eth.vm.engine.rpc_url')
    this.rpc = jayson.client.https(rpcUrl)
  }

  public async get(key: Buffer, opts: TrieDBOptions, cb: Callback) {
    const keyStr = key.toString()
    this.redis.get(keyStr, (err: Error, result: string | null) => {
      if (!err && result) {
        cb(null, Buffer.from(result, 'hex'))
        return
      }
      // Otherwise retrieve from RPC
      try {
        const res = this.rpc.request('eth_getKeyValue', ['0x' + key.toString('hex')])
        const buffer: Buffer = Buffer.from(res.substring(2), 'hex')
        this.redis.set(keyStr, buffer.toString('hex'))
        cb(null, buffer)
      } catch (e) {
        cb(err, null)
      }
    })
  }

  public put(key: Buffer, val: Buffer, opts: TrieDBOptions, cb: Callback) {
    const keyStr = key.toString()
    this.redis.set(keyStr, val, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, Buffer.from(result, 'hex'))
        return
      }

      cb(err, null)
    })
  }

  public del(key: Buffer, cb: Callback) {
    throw new Error('Method not implemented.')
  }

  public batch(ops: any[], opts: TrieDBOptions, cb: Callback) {
    throw new Error('Method not implemented.')
  }
}
