import { Block } from '@app/server/modules/blocks'
import { ExchangeRate } from '@app/server/modules/exchanges'
import { Tx } from '@app/server/modules/txs'
import { Repository } from '@app/server/repositories'

export interface CacheRepository extends Repository {
  initialize(): Promise<boolean>
  putBlock(block: Block): Promise<boolean>
  getBlocks(limit: number, page: number): Promise<Block[]>
  putTransactions(txs: Tx[]): Promise<boolean>
  getTransactions(limit: number, page: number): Promise<Tx[]>
  putExchangeRate(exchangerate: ExchangeRate): Promise<boolean>
  getExchangeRate(token: string): Promise<ExchangeRate>
  getExchangeRates(token: string[]): Promise<ExchangeRate[]>
}
