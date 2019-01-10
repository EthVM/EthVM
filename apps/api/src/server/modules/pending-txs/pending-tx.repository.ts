import { toPendingTx } from '@app/server/modules/pending-txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { PendingTx } from 'ethvm-common'

export interface PendingTxRepository {
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]>
}

export class MongoPendingTxRepository extends BaseMongoDbRepository implements PendingTxRepository {
  public getPendingTxs(limit: number, page: number): Promise<PendingTx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.pendingTxs)
      .find()
      .sort({ _id: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: PendingTx[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => {
          t.push(toPendingTx(tx))
        })
        return t
      })
  }

  public getPendingTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.pendingTxs)
      .find({ $or: [{ from: hash }, { to: hash }] })
      .sort({ transactionIndex: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: PendingTx[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => {
          t.push(toPendingTx(tx))
        })
        return t
      })
  }
}
