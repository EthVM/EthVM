import { Repository } from '@app/server/repositories'

export const RethinkEthVM = {
  tables: {
    blocks: 'blocks',
    data: 'data',
    txs: 'transactions',
    blocks_metrics: 'block_stats'
  },
  indexes: {}
}

export abstract class BaseRethinkDbRepository implements Repository {
  constructor(protected readonly conn: any, protected readonly opts: object) {}
}
