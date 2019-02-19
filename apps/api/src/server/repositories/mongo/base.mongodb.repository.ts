import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    balances: 'balances',
    blocks: 'blocks',
    blockMetrics: 'block_metrics',
    contracts: 'contracts',
    transactions: 'transactions',
    uncles: 'uncles',
    pendingTxs: 'pending_transactions',
    statistics: 'aggregate_block_metrics',
    tokenTransfers: 'token_transfers',
    accountMetadata: 'account_metadata',
    tokenExchangeRates: 'token_exchange_rates',
    processingMetadata: 'processing_metadata'
  },
  projections: {
    blocks: {
      simple: { 'header.number': 1, 'header.hash': 1, 'header.author': 1, rewards: 1, transactions: 1 }
    },
    txs: {
      simple: { hash: 1, blockNumber: 1, blockHash: 1, from: 1, to: 1, value: 1, gas: 1, gasPrice: 1, timestamp: 1, receipt: 1 }
    }
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
