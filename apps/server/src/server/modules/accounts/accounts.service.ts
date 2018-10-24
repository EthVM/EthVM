import { Account, AccountsRepository } from '@app/server/modules/accounts'
import { CacheRepository } from '@app/server/repositories'
import { Tx } from 'ethvm-models'

export interface AccountsService {
  getTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAccount(hash: string): Promise<Account | null>
  getTotalTxs(hash: string): Promise<number>
}

export class AccountsServiceImpl implements AccountsService {
  constructor(private readonly addressRepository: AccountsRepository, private readonly cacheRepository: CacheRepository) {}

  public getTxs(hash: string, limit: number, page: number): Promise<Tx[]> {
    return this.addressRepository.getTxs(hash, limit, page)
  }

  public getAccount(hash: string): Promise<Account | null> {
    return this.addressRepository.getAccount(hash)
  }

  public getTotalTxs(hash: string): Promise<number> {
    return this.addressRepository.getTotalTxs(hash)
  }
}
