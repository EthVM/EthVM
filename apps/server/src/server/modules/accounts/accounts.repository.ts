import { Account, toAccount } from '@app/server/modules/accounts'
import { Tx } from '@app/server/modules/txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface AccountsRepository {
  getTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAccount(hash: string): Promise<Account | null>
  getTotalTxs(hash: string): Promise<number>
}

export class MongoAccountsRepository extends BaseMongoDbRepository implements AccountsRepository {
  public getTotalTxs(hash: string): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .countDocuments({ $or: [{ 'transactions.from': hash }, { 'transactions.to': hash }] })
      .then(resp => {
        if (!resp) {
          return 0
        }
        return resp
      })
  }

  public getAccount(hash: string): Promise<Account | null> {
    return this.db
      .collection(MongoEthVM.collections.accounts)
      .findOne({ _id: hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toAccount(resp)
      })
  }

  public getTxs(hash: string, limit: number, page: number): Promise<Tx[]> {
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
}
