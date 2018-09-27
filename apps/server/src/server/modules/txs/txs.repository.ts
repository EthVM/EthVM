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
    const end = start + limit
    return Promise.reject()
  }

  public getBlockTxs(hash: string): Promise<Tx[]> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ _id: hash }, { projection: { number: 1, hash: 1, transactions: 1 } })
      .then(resp => {
        if (!resp) {
          return []
        }

        // TODO: Add number and hash to each of transactions (instead of returning directly)
        return resp.transactions
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
    const end = start + limit
    const bhash = hexToBuffer(hash)

    return Promise.reject()
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
