import { BalancesRepository } from '@app/server/modules/balances'
import { AddressBalance } from 'ethvm-common'

export interface BalancesService {
  getAddressBalance(hash: string): Promise<AddressBalance | null>
}

export class BalancesServiceImpl implements BalancesService {
  constructor(private readonly balancesRepository: BalancesRepository) {}

  public getAddressBalance(hash: string): Promise<AddressBalance | null> {
    return this.balancesRepository.getAddressBalance(hash)
  }

}
