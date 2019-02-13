import { toTx } from '@app/server/modules/txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Tx } from 'ethvm-common'

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getTxsOfBlock(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]>
  getAddressTotalTxs(hash: string): Promise<number>
  getTotalNumberOfTxs(): Promise<number>
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
      .then(resp => resp ? resp.map(tx => toTx(tx)) : [])
  }

  public getTxsOfBlock(hash: string): Promise<Tx[]> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ blockHash: hash })
      .toArray()
      .then(resp => resp ? resp.map(tx => toTx(tx)) : [])
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .findOne({ hash })
      .then(resp => resp ? toTx(resp) : null)
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    let find
    switch (filter) {
      case 'in':
        find = { from: hash }
        break
      case 'out':
        find = { to: hash }
        break
      default:
        find = { $or: [{ from: hash }, { to: hash }] }
        break
    }
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find(find)
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(tx => toTx(tx)) : [])
  }

  public getAddressTotalTxs(hash: string): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .countDocuments({ $or: [{ from: hash }, { to: hash }] })
      .then(resp => resp ? resp : 0)
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .estimatedDocumentCount()
  }
}
