import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    accounts: 'accounts',
    blocks: 'blocks',
    transactions: 'transactions',
    uncles: 'uncles',
    statistics: 'statistics',
    pendingTxs: 'pending_transactions'
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
