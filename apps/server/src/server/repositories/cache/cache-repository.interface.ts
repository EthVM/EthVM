import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import { Repository } from '@app/server/repositories'

export interface CacheRepository extends Repository {
  initialize(): Promise<boolean>
  putBlock(block: Block): Promise<boolean>
  getBlocks(limit: number, page: number): Promise<Block[]>
  putTransactions(txs: Tx[]): Promise<boolean>
  getTransactions(limit: number, page: number): Promise<Tx[]>
}
