import { Repository } from '@app/server/repositories'

export const RethinkEthVM = {
  tables: {
    blocks: 'blocks',
    txs: 'transactions',
    blocks_metrics: 'blocks_metrics'
  },
  indexes: {}
}

export abstract class BaseRethinkDbRepository implements Repository {
  constructor(protected readonly conn: any, protected readonly opts: object) {}
}
