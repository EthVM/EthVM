import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { AddressMetadata } from 'ethvm-common'

export interface AddressesRepository {
  getAddressMetadata(hash: string): Promise<AddressMetadata | null>
}

export class MongoAddressesRepository extends BaseMongoDbRepository implements AddressesRepository {
  public getAddressMetadata(hash: string): Promise<AddressMetadata | null> {
    return this.db
      .collection(MongoEthVM.collections.accountMetadata)
      .findOne({ _id: hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return resp
      })
  }
}
