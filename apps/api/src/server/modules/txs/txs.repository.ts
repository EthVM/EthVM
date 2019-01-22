import { toTx } from '@app/server/modules/txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Tx } from 'ethvm-common'

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getTxsOfBlock(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getAddressTotalTxs(hash: string): Promise<number>
}

export class MongoTxsRepository extends BaseMongoDbRepository implements TxsRepository {
  public getTxs(limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find()
      .sort({ _id: -1, index: 1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: Tx[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => {
          t.push(toTx(tx))
        })
        return t
      })
  }

  public getTxsOfBlock(hash: string): Promise<Tx[]> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ blockHash: hash })
      .toArray()
      .then(resp => {
        const t: Tx[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => t.push(toTx(tx)))
        return t
      })
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .findOne({ hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toTx(resp)
      })
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ $or: [{ from: hash }, { to: hash }] })
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: Tx[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => {
          t.push(toTx(tx))
        })
        return t
      })
  }

  public getAddressTotalTxs(hash: string): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .countDocuments({ $or: [{ from: hash }, { to: hash }] })
      .then(resp => {
        if (!resp) {
          return 0
        }
        return resp
      })
  }
}
