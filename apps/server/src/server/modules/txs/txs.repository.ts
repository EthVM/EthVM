import { hexToBuffer } from '@app/server/core/utils'
import { Tx } from '@app/server/modules/txs'
import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/repositories'
import * as r from 'rethinkdb'

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getBlockTxs(hash: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class RethinkTxsRepository extends BaseRethinkDbRepository implements TxsRepository {
  public getTxs(limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    const end = start + limit

    return r
      .table(RethinkEthVM.tables.txs)
      .slice(start, end)
      .run(this.conn)
      .then(cursor => cursor.toArray())
  }

  public getBlockTxs(hash: Buffer): Promise<Tx[]> {
    return r
      .table(RethinkEthVM.tables.blocks)
      .get(r.args([hash]))
      .do(block =>
        r
          .table(RethinkEthVM.tables.txs)
          .getAll(r.args(block('transactionHashes')))
          .coerceTo('array')
      )
      .run(this.conn)
  }

  public getTx(hash: string): Promise<Tx | null> {
    return r
      .table(RethinkEthVM.tables.txs)
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r.table('traces').get(tx('hash')),
          logs: r.table('logs').get(tx('hash'))
        }
      })
      .run(this.conn)
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    const end = start + limit
    const bhash = hexToBuffer(hash)

    return r
      .table(RethinkEthVM.tables.txs)
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .slice(start, end)
      .run(this.conn)
      .then(cursor => cursor.toArray())
  }

  public getTotalTxs(hash: string): Promise<number> {
    const bhash = hexToBuffer(hash)
    return r
      .table(RethinkEthVM.tables.txs)
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.conn)
  }
}
