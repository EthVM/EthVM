import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    balances: 'balances',
    blocks: 'blocks',
    transactions: 'transactions',
    uncles: 'uncles',
    pendingTxs: 'pending_transactions',
    statistics: 'block_statistics',
    contracts: 'contracts',
    tokenTransfers: 'token_transfers'
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
