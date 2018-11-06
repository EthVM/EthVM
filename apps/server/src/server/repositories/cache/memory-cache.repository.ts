import { CacheRepository } from '@app/server/repositories'
import { Block, ExchangeRate, Quote, Tx } from 'ethvm-common'

export class MemoryCacheRepository implements CacheRepository {
  public initialize(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  public putBlock(block: Block): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  public getBlocks(): Promise<Block[]> {
    throw new Error('Method not implemented.')
  }

  public putTransactions(txs: Tx[]): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  public getTransactions(): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public putRate(exchangerate: ExchangeRate): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  public getQuote(token: string, to: string): Promise<Quote> {
    throw new Error('Method not implemented.')
  }
}
