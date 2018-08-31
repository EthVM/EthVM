import { hexToBuffer } from '@app/server/core/utils'
import { Tx } from '@app/server/modules/txs'

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getBlockTxs(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class MockTxsRepository implements TxsRepository {
  public getTxs(limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    const end = start + limit
    return Promise.reject()
  }

  public getBlockTxs(hash: string): Promise<Tx[]> {
    return Promise.reject()
  }

  public getTx(hash: string): Promise<Tx | null> {
    return Promise.reject()
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    const end = start + limit
    const bhash = hexToBuffer(hash)

    return Promise.reject()
  }

  public getTotalTxs(hash: string): Promise<number> {
    const bhash = hexToBuffer(hash)
    return Promise.reject()
  }
}
