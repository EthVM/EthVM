import { logger } from '@app/logger'
import { hexToBuffer } from '@app/server/core/utils'
import { Tx } from '@app/server/modules/txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getBlockTxs(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class MongoTxsRepository extends BaseMongoDbRepository implements TxsRepository {
  public getTxs(limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find()
      .sort({ transactionIndex: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }
        return resp
      })
  }

  public getBlockTxs(hash: string): Promise<Tx[]> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ blockHash: hash })
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }
        return resp
      })
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .findOne({ _id: hash })
      .then(resp => {
        if (!resp) {
          return {}
        }
        return resp
      })
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ $or: [{ from: hash }, { to: hash }] })
      .sort({ transactionIndex: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }
        return resp
      })
  }

  public getTotalTxs(hash: string): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .count({ $or: [{ from: hash }, { to: hash }] })
      .then(resp => {
        if (!resp) {
          return 0
        }
        return resp
      })
  }
}
