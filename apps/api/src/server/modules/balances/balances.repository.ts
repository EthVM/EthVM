import { toBalance } from '@app/server/modules/balances'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { AddressBalance } from 'ethvm-common'

export interface BalancesRepository {
  getAddressBalance(hash: string): Promise<AddressBalance | null>
}

export class MongoBalancesRepository extends BaseMongoDbRepository implements BalancesRepository {
  public getAddressBalance(hash: string): Promise<AddressBalance | null> {
    return this.db
      .collection(MongoEthVM.collections.balances)
      .findOne({ address: hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBalance(resp)
      })
  }
}
