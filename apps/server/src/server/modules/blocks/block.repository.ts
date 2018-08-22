import { Block } from '@app/server/modules/blocks'
import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/repositories'
import * as r from 'rethinkdb'

export interface BlocksRepository {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: Buffer): Promise<Block | null>
}

export class RethinkBlockRepository extends BaseRethinkDbRepository implements BlocksRepository {
  public getBlocks(limit: number, page: number): Promise<Block[]> {
    const start = page * limit
    const end = start + limit

    return r
      .table(RethinkEthVM.tables.blocks)
      .orderBy({ index: r.desc('intNumber') })
      .merge(b => {
        return {
          blockStats: r.table(RethinkEthVM.tables.blocks_metrics).get(b('hash'))
        }
      })
      .slice(start, end)
      .run(this.conn)
      .then(cursor => cursor.toArray())
  }

  public getBlock(hash: Buffer): Promise<Block | null> {
    return r
      .table(RethinkEthVM.tables.blocks)
      .get(r.args([hash]))
      .run(this.conn)
  }
}
