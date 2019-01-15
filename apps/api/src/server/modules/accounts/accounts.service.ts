import { AccountsRepository } from '@app/server/modules/accounts'
import { Account, Tx } from 'ethvm-common'

export interface AccountsService {
  getAccount(hash: string): Promise<Account | null>
  getAccountTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAccountTotalTxs(hash: string): Promise<number>
}

export class AccountsServiceImpl implements AccountsService {
  constructor(private readonly addressRepository: AccountsRepository) {}

  public getAccount(hash: string): Promise<Account | null> {
    return this.addressRepository.getAccount(hash)
  }

  public getAccountTxs(hash: string, limit: number, page: number): Promise<Tx[]> {
    return this.addressRepository.getAccountTxs(hash, limit, page)
  }

  public getAccountTotalTxs(hash: string): Promise<number> {
    return this.addressRepository.getAccountTotalTxs(hash)
  }
}
