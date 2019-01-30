import { AddressesRepository } from '@app/server/modules/addresses'
import { AddressMetadata } from 'ethvm-common'

export interface AddressesService {
  getAddressMetadata(hash: string): Promise<AddressMetadata | null>
}

export class AddressesServiceImpl implements AddressesService {
  constructor(private readonly addressesRepository: AddressesRepository) {}

  public getAddressMetadata(hash: string): Promise<AddressMetadata | null> {
    return this.addressesRepository.getAddressMetadata(hash)
  }

}
