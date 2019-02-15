import { TxsRepository } from '@app/server/modules/txs'
import { Tx } from 'ethvm-common'

export interface TxsService {
  getTxs(limit: number, order: string, fromBlock: number): Promise<Tx[]>
  getTx(hash: string): Promise<Tx | null>
  getTxsOfBlock(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]>
  getTotalNumberOfTxs(): Promise<number>
}

export class TxsServiceImpl implements TxsService {
  constructor(private readonly txsRepository: TxsRepository) {}

  public getTxs(limit: number, order: string, fromBlock: number): Promise<Tx[]> {
    return this.txsRepository.getTxs(limit, order, fromBlock)
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.txsRepository.getTx(hash)
  }

  public getTxsOfBlock(hash: string): Promise<Tx[]> {
    return this.txsRepository.getTxsOfBlock(hash)
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number = 10, page: number = 0): Promise<Tx[]> {
    return this.txsRepository.getTxsOfAddress(hash, filter, limit, page)
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.txsRepository.getTotalNumberOfTxs()
  }
}
