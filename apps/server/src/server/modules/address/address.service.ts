import { Address, AddressRepository } from '@app/server/modules/address'
import { Tx } from '@app/server/modules/txs'

import { CacheRepository } from '@app/server/repositories'

export interface AddressService {
  getTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAddress(hash: string): Promise<Address>
  getTotalTxs(hash: string): Promise<number>
}

export class AddressServiceImpl implements AddressService {
  constructor(private readonly addressRepository: AddressRepository, private readonly cacheRepository: CacheRepository) {}
  public getTxs(hash: string, limit: number, page: number): Promise<Tx[]> {
    return this.addressRepository.getTxs(hash, limit, page)
  }
  public getAddress(hash: string): Promise<Address> {
    return this.addressRepository.getAddress(hash)
  }

  public getTotalTxs(hash: string): Promise<number> {
    return this.addressRepository.getTotalTxs(hash)
  }
}
