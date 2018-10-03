import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    addresses: 'addresses',
    blocks: 'blocks',
    transactions: 'transactions',
    uncles: 'uncles',
    pendingTxs: 'pending_transactions'
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
