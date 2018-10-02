import { Tx, TxsRepository } from '@app/server/modules/txs'
import { CacheRepository } from '@app/server/repositories'

export interface TxsService {
  getTxs(limit: number, page: number): Promise<Tx[]>
  getTx(hash: string): Promise<Tx | null>
  getBlockTxs(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
}

export class TxsServiceImpl implements TxsService {
  constructor(private readonly txsRepository: TxsRepository, private readonly cacheRepository: CacheRepository) {}

  public getTxs(limit: number, page: number): Promise<Tx[]> {
    return this.txsRepository.getTxs(limit, page)
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.txsRepository.getTx(hash)
  }

  public getBlockTxs(hash: string): Promise<Tx[]> {
    return this.txsRepository.getBlockTxs(hash)
  }

  public getTxsOfAddress(hash: string, limit: number = 10, page: number = 0): Promise<Tx[]> {
    return this.txsRepository.getTxsOfAddress(hash, limit, page)
  }
}
