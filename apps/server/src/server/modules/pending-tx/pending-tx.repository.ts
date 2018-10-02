import { PendingTx } from '@app/server/modules/pending-tx'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface PendingTxRepository {
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
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
        if (!resp) {
          return []
        }
        return resp
      })
  }
}
