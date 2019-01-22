import { BalancesRepository } from '@app/server/modules/balances'
import { VmEngine } from '@app/server/modules/vm'
import { AddressBalance } from 'ethvm-common'

export interface BalancesService {
  getAddressBalance(hash: string): Promise<AddressBalance | null>
  getAddressTokenBalance(address: string): Promise<any>
}

export class BalancesServiceImpl implements BalancesService {
  constructor(private readonly balancesRepository: BalancesRepository, private readonly vme: VmEngine) {}

  public getAddressBalance(hash: string): Promise<AddressBalance | null> {
    return this.balancesRepository.getAddressBalance(hash)
  }

  public getAddressTokenBalance(address: string): Promise<any> {
    return this.vme.getBalance(address)
  }

}
