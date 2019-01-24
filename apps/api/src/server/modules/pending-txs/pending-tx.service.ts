import { PendingTxRepository } from '@app/server/modules/pending-txs'
import { PendingTx } from 'ethvm-common'

export interface PendingTxService {
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<PendingTx[]>
}

export class PendingTxServiceImpl implements PendingTxService {
  constructor(private readonly pendingTxRepository: PendingTxRepository) {}

  public getPendingTxs(limit: number, page: number): Promise<PendingTx[]> {
    return this.pendingTxRepository.getPendingTxs(limit, page)
  }

  public getPendingTxsOfAddress(hash: string, filter: string, limit: number = 10, page: number = 0): Promise<PendingTx[]> {
    return this.pendingTxRepository.getPendingTxsOfAddress(hash, filter, limit, page)
  }
}
