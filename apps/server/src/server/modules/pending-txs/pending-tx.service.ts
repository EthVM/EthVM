import { PendingTxRepository } from '@app/server/modules/pending-txs'
import { CacheRepository } from '@app/server/repositories'
import { PendingTx } from 'ethvm-models'

export interface PendingTxService {
  getTxs(limit: number, page: number): Promise<PendingTx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]>
}

export class PendingTxServiceImpl implements PendingTxService {
  constructor(private readonly pendingTxRepository: PendingTxRepository, private readonly cacheRepository: CacheRepository) {}
  public getTxs(limit: number, page: number): Promise<PendingTx[]> {
    return this.pendingTxRepository.getPendingTxs(limit, page)
  }

  public getTxsOfAddress(hash: string, limit: number = 10, page: number = 0): Promise<PendingTx[]> {
    return this.pendingTxRepository.getTxsOfAddress(hash, limit, page)
  }
}
